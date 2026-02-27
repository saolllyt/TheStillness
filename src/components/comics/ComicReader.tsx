import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Button } from '../common/Button';
import api from '../../services/api/client';

interface ComicReaderProps {
  visible: boolean;
  comicId: number | null;
  onClose: () => void;
}

// Маппинг PDF файлов по ID комикса
const PDF_MAPPING: { [key: number]: any } = {
  6: require('../../../assets/comics/Comics1.pdf'),
  7: require('../../../assets/comics/Comics2.pdf'),
  8: require('../../../assets/comics/Comics3.pdf'),
  9: require('../../../assets/comics/Comics4.pdf'),
  10: require('../../../assets/comics/Comics5.pdf'),
};

export const ComicReader: React.FC<ComicReaderProps> = ({ visible, comicId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [comic, setComic] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const webViewRef = useRef<WebView>(null);
  
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height * 0.8;

  useEffect(() => {
    if (visible && comicId) {
      loadComicData();
    }
  }, [visible, comicId]);

  const getPdfBase64 = async (assetModule: any): Promise<string | null> => {
    try {
      const asset = Asset.fromModule(assetModule);
      await asset.downloadAsync();
      
      if (!asset.localUri) {
        throw new Error('Could not get local URI for asset');
      }

      console.log('Asset loaded:', asset.localUri);

      const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return base64;
    } catch (error) {
      console.error('Error reading PDF:', error);
      return null;
    }
  };

  const loadComicData = async () => {
    try {
      setLoading(true);
      
      const comicRes = await api.get(`/comics/${comicId}`);
      const comicData = comicRes.data.data;
      setComic(comicData);

      if (comicId && PDF_MAPPING[comicId]) {
        try {
          const assetModule = PDF_MAPPING[comicId];
          const base64 = await getPdfBase64(assetModule);
          
          if (base64) {
            setPdfData(base64);
          } else {
            Alert.alert('Ошибка', 'Не удалось загрузить PDF файл');
          }
        } catch (assetError) {
          console.error('Error loading asset:', assetError);
          Alert.alert('Ошибка', 'PDF файл не найден или поврежден');
        }
      }

      const pagesRes = await api.get(`/comics/${comicId}/pages`);
      setPages(pagesRes.data.data.sort((a: any, b: any) => a.page_number - b.page_number));
      setCurrentPage(1);
      
    } catch (error) {
      console.error('Error loading comic:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить комикс');
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (pdfData) {
      webViewRef.current?.injectJavaScript(`
        if (window.pdfViewer && window.pdfViewer.currentPage < window.pdfViewer.totalPages) {
          window.pdfViewer.currentPage++;
          window.pdfViewer.renderPage(window.pdfViewer.currentPage);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'pageChanged',
            currentPage: window.pdfViewer.currentPage,
            totalPages: window.pdfViewer.totalPages
          }));
        }
      `);
    } else if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pdfData) {
      webViewRef.current?.injectJavaScript(`
        if (window.pdfViewer && window.pdfViewer.currentPage > 1) {
          window.pdfViewer.currentPage--;
          window.pdfViewer.renderPage(window.pdfViewer.currentPage);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'pageChanged',
            currentPage: window.pdfViewer.currentPage,
            totalPages: window.pdfViewer.totalPages
          }));
        }
      `);
    } else if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'pageChanged') {
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } else if (data.type === 'pdfLoaded') {
        setTotalPages(data.totalPages);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  const renderPdfViewer = () => {
    if (!pdfData) return null;

    const pdfHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
              background-color: ${COLORS.black};
            }
            #viewerContainer {
              width: 100%;
              height: 100%;
              overflow: auto;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            #pdf-canvas {
              max-width: 100%;
              max-height: 100%;
              width: auto;
              height: auto;
              object-fit: contain;
            }
            .loading {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: white;
              font-family: Arial, sans-serif;
            }
            .page-info {
              position: absolute;
              bottom: 20px;
              right: 20px;
              background: rgba(44, 63, 112, 0.9);
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              font-family: Arial, sans-serif;
              font-size: 14px;
              z-index: 1000;
            }
          </style>
        </head>
        <body>
          <div id="viewerContainer">
            <canvas id="pdf-canvas"></canvas>
          </div>
          <div class="page-info" id="pageInfo">Страница 1 / 1</div>
          
          <script>
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
            
            const url = 'data:application/pdf;base64,${pdfData}';
            
            window.pdfViewer = {
              pdfDoc: null,
              currentPage: 1,
              totalPages: 1,
              scale: 1.5,
              
              renderPage: function(pageNum) {
                const canvas = document.getElementById('pdf-canvas');
                const context = canvas.getContext('2d');
                
                this.pdfDoc.getPage(pageNum).then(function(page) {
                  const viewport = page.getViewport({ scale: window.pdfViewer.scale });
                  
                  canvas.width = viewport.width;
                  canvas.height = viewport.height;
                  
                  const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                  };
                  
                  page.render(renderContext);
                  
                  document.getElementById('pageInfo').innerHTML = 
                    'Страница ' + pageNum + ' / ' + window.pdfViewer.totalPages;
                });
              },
              
              load: function() {
                pdfjsLib.getDocument(url).promise.then((pdf) => {
                  this.pdfDoc = pdf;
                  this.totalPages = pdf.numPages;
                  this.renderPage(1);
                  
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'pdfLoaded',
                    totalPages: this.totalPages
                  }));
                }).catch(function(error) {
                  console.error('PDF.js error:', error);
                  document.getElementById('viewerContainer').innerHTML = 
                    '<div style="color:white;text-align:center;">Ошибка загрузки PDF</div>';
                });
              }
            };
            
            window.pdfViewer.load();
          </script>
        </body>
      </html>
    `;

    return (
      <View style={styles.pdfContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: pdfHtml }}
          style={styles.webview}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Загрузка PDF...</Text>
            </View>
          )}
        />
      </View>
    );
  };

  const renderImageViewer = () => {
    if (pages.length === 0) return null;
    
    const currentPageData = pages[currentPage - 1];

    return (
      <ScrollView 
        style={styles.imageScrollView}
        contentContainerStyle={styles.imageScrollContent}
        maximumZoomScale={3.0}
        minimumZoomScale={1.0}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: currentPageData.image_url }}
          style={styles.pageImage}
          resizeMode="contain"
        />
      </ScrollView>
    );
  };

  const renderThumbnails = () => {
    if (pages.length <= 1) return null;
    
    return (
      <View style={styles.thumbnailsContainer}>
        <FlatList
          data={pages}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.thumbnailWrapper,
                currentPage === index + 1 && styles.thumbnailActive,
              ]}
              onPress={() => setCurrentPage(index + 1)}
            >
              <Image
                source={{ uri: item.image_url }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  const renderTextContent = () => {
    if (pages.length === 0) return null;
    
    const currentPageData = pages[currentPage - 1];
    
    if (!currentPageData.text_content) return null;
    
    return (
      <View style={styles.textContentContainer}>
        <Text style={styles.textContent}>{currentPageData.text_content}</Text>
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            {comic?.title || 'Загрузка...'} 
            {pdfData && ` — стр. ${currentPage}/${totalPages}`}
            {!pdfData && pages.length > 0 && ` — стр. ${currentPage}/${pages.length}`}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {loading && !comic ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <>
            <View style={styles.readerArea}>
              {pdfData ? renderPdfViewer() : renderImageViewer()}
              
              {/* Навигационные кнопки без затемнения */}
              <View style={styles.navigationOverlay}>
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    (pdfData ? currentPage === 1 : currentPage === 1) && styles.navButtonDisabled
                  ]}
                  onPress={handlePrevPage}
                  disabled={pdfData ? currentPage === 1 : currentPage === 1}
                >
                  <Feather
                    name="chevron-left"
                    size={40}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    (pdfData ? currentPage === totalPages : currentPage === pages.length) && styles.navButtonDisabled
                  ]}
                  onPress={handleNextPage}
                  disabled={pdfData ? currentPage === totalPages : currentPage === pages.length}
                >
                  <Feather
                    name="chevron-right"
                    size={40}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {!pdfData && renderTextContent()}
            {!pdfData && renderThumbnails()}

            <View style={styles.footer}>
              <Button
                title="Закрыть"
                onPress={onClose}
                variant="primary"
                size="large"
                style={styles.closeFooterButton}
              />
            </View>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.small,
  },
  closeButton: {
    padding: SPACING.sm,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  readerArea: {
    flex: 1,
    backgroundColor: COLORS.black,
    position: 'relative',
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  webview: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  imageScrollView: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  imageScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
    resizeMode: 'contain',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
  },
  loadingText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.white,
    marginTop: SPACING.md,
  },
  navigationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  textContentContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.small,
  },
  textContent: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text,
    lineHeight: 24,
  },
  thumbnailsContainer: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    maxHeight: 100,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  thumbnailWrapper: {
    width: 60,
    height: 80,
    marginRight: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: COLORS.primary,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  closeFooterButton: {
    width: '100%',
  },
});