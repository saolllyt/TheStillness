import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import api from '../../services/api/client';

interface ComicReaderProps {
  visible: boolean;
  comicId: number | null;
  onClose: () => void;
}

// Маппинг PDF файлов по полю pdf_url из БД (стабильный ключ, не зависит от ID строки)
const PDF_MAPPING: { [key: string]: any } = {
  Comics1:  require('../../../assets/comics/Comics1.pdf'),
  Comics2:  require('../../../assets/comics/Comics2.pdf'),
  Comics3:  require('../../../assets/comics/Comics3.pdf'),
  Comics4:  require('../../../assets/comics/Comics4.pdf'),
  Comics5:  require('../../../assets/comics/Comics5.pdf'),
  Comics12: require('../../../assets/comics/Comics12.pdf'),
  Comics13: require('../../../assets/comics/Comics13.pdf'),
  Comics14: require('../../../assets/comics/Comics14.pdf'),
  Comics16: require('../../../assets/comics/Comics16.pdf'),
  Comics18: require('../../../assets/comics/Comics18.pdf'),
  Comics19: require('../../../assets/comics/Comics19.pdf'),
  Comics20: require('../../../assets/comics/Comics20.pdf'),
  Comics21: require('../../../assets/comics/Comics21.pdf'),
  Comics22: require('../../../assets/comics/Comics22.pdf'),
  Comics23: require('../../../assets/comics/Comics23.pdf'),
  Comics24: require('../../../assets/comics/Comics24.pdf'),
  Comics25: require('../../../assets/comics/Comics25.pdf'),
  Comics26: require('../../../assets/comics/Comics26.pdf'),
  Comics28: require('../../../assets/comics/Comics28.pdf'),
  Comics29: require('../../../assets/comics/Comics29.pdf'),
  Comics30: require('../../../assets/comics/Comics30.pdf'),
  Comics31: require('../../../assets/comics/Comics31.pdf'),
  Comics32: require('../../../assets/comics/Comics32.pdf'),
  Comics33: require('../../../assets/comics/Comics33.pdf'),
};

export const ComicReader: React.FC<ComicReaderProps> = ({ visible, comicId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [comic, setComic] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (visible && comicId) {
      loadComicData();
    }
    if (!visible) {
      // сброс состояния при закрытии
      setComic(null);
      setPages([]);
      setPdfData(null);
      setCurrentPage(1);
      setTotalPages(1);
    }
  }, [visible, comicId]);

  const getPdfBase64FromAsset = async (assetModule: any): Promise<string | null> => {
    try {
      const asset = Asset.fromModule(assetModule);
      await asset.downloadAsync();
      if (!asset.localUri) throw new Error('No localUri');
      return await FileSystem.readAsStringAsync(asset.localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch {
      return null;
    }
  };

  const getPdfBase64FromUrl = async (url: string): Promise<string | null> => {
    try {
      const cacheKey = url.replace(/[^a-zA-Z0-9]/g, '_');
      const cacheUri = `${FileSystem.cacheDirectory}${cacheKey}.pdf`;
      const info = await FileSystem.getInfoAsync(cacheUri);
      if (!info.exists) {
        await FileSystem.downloadAsync(url, cacheUri);
      }
      return await FileSystem.readAsStringAsync(cacheUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch {
      return null;
    }
  };

  const SERVER_BASE = 'http://127.0.0.1:3001';

  const loadComicData = async () => {
    try {
      setLoading(true);
      const comicRes = await api.get(`/comics/${comicId}`);
      const comicData = comicRes.data.data;
      setComic(comicData);

      const pdfKey = comicData?.pdf_url as string | null;
      let base64: string | null = null;

      if (pdfKey) {
        if (pdfKey.startsWith('books/')) {
          // PDF загружен через админ-панель скачиваем с сервера
          base64 = await getPdfBase64FromUrl(`${SERVER_BASE}/${pdfKey}`);
        } else if (PDF_MAPPING[pdfKey]) {
          // Локальный 
          base64 = await getPdfBase64FromAsset(PDF_MAPPING[pdfKey]);
        }
      }

      if (base64) {
        setPdfData(base64);
      }

      const pagesRes = await api.get(`/comics/${comicId}/pages`);
      setPages(pagesRes.data.data.sort((a: any, b: any) => a.page_number - b.page_number));
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading comic:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить книгу');
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => {
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
      setCurrentPage(p => p + 1);
    }
  };

  const goPrev = () => {
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
      setCurrentPage(p => p - 1);
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
    } catch {}
  };

  const total = pdfData ? totalPages : pages.length;
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= total;

  const renderPdfViewer = () => {
    if (!pdfData) return null;

    const pdfHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
          <style>
            * { margin:0; padding:0; box-sizing:border-box; }
            body, html { width:100%; height:100%; overflow:hidden; background:#f6f6f6; }
            #viewerContainer {
              width:100%; height:100%; display:flex;
              justify-content:center; align-items:center; overflow:auto;
            }
            #pdf-canvas { max-width:100%; max-height:100%; object-fit:contain; }
          </style>
        </head>
        <body>
          <div id="viewerContainer">
            <canvas id="pdf-canvas"></canvas>
          </div>
          <script>
            pdfjsLib.GlobalWorkerOptions.workerSrc =
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
            const url = 'data:application/pdf;base64,${pdfData}';
            window.pdfViewer = {
              pdfDoc: null, currentPage: 1, totalPages: 1, scale: 1.5,
              renderPage: function(num) {
                const canvas = document.getElementById('pdf-canvas');
                const ctx = canvas.getContext('2d');
                this.pdfDoc.getPage(num).then(function(page) {
                  const vp = page.getViewport({ scale: window.pdfViewer.scale });
                  canvas.width = vp.width;
                  canvas.height = vp.height;
                  page.render({ canvasContext: ctx, viewport: vp });
                });
              },
              load: function() {
                pdfjsLib.getDocument(url).promise.then((pdf) => {
                  this.pdfDoc = pdf;
                  this.totalPages = pdf.numPages;
                  this.renderPage(1);
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'pdfLoaded', totalPages: this.totalPages
                  }));
                }).catch(function(e) {
                  document.body.innerHTML =
                    '<div style="color:#fff;text-align:center;padding:40px;">Ошибка загрузки</div>';
                });
              }
            };
            window.pdfViewer.load();
          </script>
        </body>
      </html>
    `;

    return (
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

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Шапка */}
        <SafeAreaView edges={['top']} style={styles.headerSafe}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x" size={22} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={1}>
              {comic?.title || 'Загрузка...'}
            </Text>
            <View style={styles.pageCounter}>
              <Text style={styles.pageCounterText}>{currentPage}/{total || 1}</Text>
            </View>
          </View>
        </SafeAreaView>

        {/* Контент */}
        <View style={styles.readerArea}>
          {loading && !comic ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Загрузка...</Text>
            </View>
          ) : (
            pdfData ? renderPdfViewer() : renderImageViewer()
          )}
        </View>

        {/* Нижняя панель навигации */}
        <SafeAreaView edges={['bottom']} style={styles.navBarSafe}>
          <View style={styles.navBar}>
            <TouchableOpacity
              style={[styles.navBtn, isFirst && styles.navBtnDisabled]}
              onPress={goPrev}
              disabled={isFirst}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Feather name="chevron-left" size={28} color={isFirst ? COLORS.border : COLORS.primary} />
            </TouchableOpacity>

            {/* Точки для image-режима */}
            {!pdfData && pages.length > 1 && pages.length <= 12 ? (
              <View style={styles.dotRow}>
                {pages.map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => setCurrentPage(i + 1)}>
                    <View style={[styles.dot, i + 1 === currentPage && styles.dotActive]} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.navPageLabel}>{currentPage} / {total || 1}</Text>
            )}

            <TouchableOpacity
              style={[styles.navBtn, isLast && styles.navBtnDisabled]}
              onPress={goNext}
              disabled={isLast}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Feather name="chevron-right" size={28} color={isLast ? COLORS.border : COLORS.primary} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerSafe: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    ...TYPOGRAPHY.body1,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
  },
  pageCounter: {
    minWidth: 38,
    alignItems: 'flex-end',
  },
  pageCounterText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 12,
  },
  readerArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webview: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageScrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.7,
  },
  pageImage: {
    width: width,
    height: height * 0.82,
    resizeMode: 'contain',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
  },
  navBarSafe: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtnDisabled: {
    backgroundColor: COLORS.background,
  },
  navPageLabel: {
    ...TYPOGRAPHY.body1,
    color: COLORS.primary,
    fontWeight: '600',
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 20,
    borderRadius: 3.5,
  },
});
