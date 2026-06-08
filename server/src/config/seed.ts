import { pool } from './database';

// Книги — каждая привязана к конкретному PDF-файлу через pdf_url
const COMICS_SEED = [
  {
    title: 'Осознанность каждый день',
    author: 'Тич Нат Хан',
    description: 'Практики медитации и осознанного присутствия',
    cover_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    pdf_url: 'Comics1',
  },
  {
    title: 'Путь к спокойствию',
    author: 'Тхить Нят Хань',
    description: 'Книга о принятии себя и внутреннем мире',
    cover_image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
    pdf_url: 'Comics2',
  },
  {
    title: 'Сила настоящего момента',
    author: 'Экхарт Толле',
    description: 'Руководство к духовному просветлению',
    cover_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    pdf_url: 'Comics3',
  },
  {
    title: 'Эмоциональный интеллект',
    author: 'Дэниел Гоулман',
    description: 'Почему он важнее, чем IQ',
    cover_image_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
    pdf_url: 'Comics4',
  },
  {
    title: 'Антистресс',
    author: 'Ромен Жийа',
    description: 'Как победить стресс, тревогу и депрессию',
    cover_image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80',
    pdf_url: 'Comics5',
  },
  {
    title: 'Исцеление через осознанность',
    author: 'Джон Кабат-Зинн',
    description: 'Снижение стресса на основе практики осознанности',
    cover_image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    pdf_url: 'Comics12',
  },
  {
    title: 'Тревога: путь к свободе',
    author: 'Клэр Уикс',
    description: 'Практическое руководство по преодолению тревожности',
    cover_image_url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&q=80',
    pdf_url: 'Comics13',
  },
  {
    title: 'Самосострадание',
    author: 'Кристин Нефф',
    description: 'Перестаньте себя критиковать и начните жить',
    cover_image_url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=80',
    pdf_url: 'Comics14',
  },
  {
    title: 'Психология счастья',
    author: 'Мартин Селигман',
    description: 'Как достичь подлинного счастья и процветания',
    cover_image_url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400&q=80',
    pdf_url: 'Comics16',
  },
  {
    title: 'Арт-терапия: исцеление творчеством',
    author: 'Кейт Карр',
    description: 'Как рисование и творчество помогают справиться со стрессом',
    cover_image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80',
    pdf_url: 'Comics18',
  },
  {
    title: 'Дыши глубже',
    author: 'Бел Педриан',
    description: 'Дыхательные практики для здоровья и спокойствия',
    cover_image_url: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&q=80',
    pdf_url: 'Comics19',
  },
  {
    title: 'Позитивное мышление',
    author: 'Норман Пил',
    description: 'Сила позитивного мышления как инструмент изменения жизни',
    cover_image_url: 'https://images.unsplash.com/photo-1468476396571-4d6f2a427ee7?w=400&q=80',
    pdf_url: 'Comics20',
  },
  {
    title: 'Медитация для начинающих',
    author: 'Джек Корнфилд',
    description: 'Пошаговое руководство по медитации для новичков',
    cover_image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80',
    pdf_url: 'Comics21',
  },
  {
    title: 'Стресс-менеджмент',
    author: 'Ариэль Шварц',
    description: 'Эффективные стратегии управления стрессом в современной жизни',
    cover_image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    pdf_url: 'Comics22',
  },
  {
    title: 'Гармония внутри',
    author: 'Луиза Хей',
    description: 'Исцели своё тело и разум с помощью позитивных аффирмаций',
    cover_image_url: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=400&q=80',
    pdf_url: 'Comics23',
  },
  {
    title: 'Исцеляющие практики',
    author: 'Питер Левин',
    description: 'Как тело освобождается от травмы и восстанавливает здоровье',
    cover_image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
    pdf_url: 'Comics24',
  },
  {
    title: 'Путь к себе',
    author: 'Карл Юнг',
    description: 'Самопознание как основа психологического здоровья',
    cover_image_url: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&q=80',
    pdf_url: 'Comics25',
  },
  {
    title: 'Осознанное питание',
    author: 'Тич Нат Хан',
    description: 'Как еда, разум и осознанность связаны между собой',
    cover_image_url: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&q=80',
    pdf_url: 'Comics26',
  },
  {
    title: 'Эмоциональная свобода',
    author: 'Джудит Орлофф',
    description: 'Освобождение от негативных эмоций и обретение внутренней свободы',
    cover_image_url: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80',
    pdf_url: 'Comics28',
  },
  {
    title: 'Психология отношений',
    author: 'Джон Готтман',
    description: 'Научный подход к построению здоровых и счастливых отношений',
    cover_image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
    pdf_url: 'Comics29',
  },
  {
    title: 'Сила привычек',
    author: 'Чарльз Дахигг',
    description: 'Почему мы делаем то, что делаем, и как это изменить',
    cover_image_url: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400&q=80',
    pdf_url: 'Comics30',
  },
  {
    title: 'Ментальное здоровье',
    author: 'Мэтт Хэйг',
    description: 'Честная книга о борьбе с депрессией и тревогой',
    cover_image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80',
    pdf_url: 'Comics31',
  },
  {
    title: 'Энергия жизни',
    author: 'Брене Браун',
    description: 'Как уязвимость делает нас сильнее и счастливее',
    cover_image_url: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&q=80',
    pdf_url: 'Comics32',
  },
  {
    title: 'Внутренний компас',
    author: 'Виктор Франкл',
    description: 'В поисках смысла жизни как основы психического здоровья',
    cover_image_url: 'https://images.unsplash.com/photo-1465188162913-8fb5709d6d57?w=400&q=80',
    pdf_url: 'Comics33',
  },
];

export const seedComics = async (): Promise<void> => {
  try {
    let inserted = 0;
    let updated = 0;

    for (const comic of COMICS_SEED) {
      const existing = await pool.query(
        'SELECT id FROM comics WHERE title = $1',
        [comic.title],
      );

      if (existing.rows.length === 0) {
        await pool.query(
          'INSERT INTO comics (title, author, description, cover_image_url, pdf_url, is_active) VALUES ($1, $2, $3, $4, $5, true)',
          [comic.title, comic.author, comic.description, comic.cover_image_url, comic.pdf_url],
        );
        inserted++;
      } else {
        // Обновляем обложку и pdf_url
        await pool.query(
          `UPDATE comics SET cover_image_url = $1, pdf_url = $2 WHERE title = $3`,
          [comic.cover_image_url, comic.pdf_url, comic.title],
        );
        updated++;
      }
    }

    if (inserted > 0 || updated > 0) {
      console.log(` Книги: +${inserted} добавлено, ${updated} обновлено`);
    }
  } catch (error) {
    console.error(' Ошибка при инициализации книг:', error);
  }
};

const PLAYLISTS_SEED = [
  {
    title: 'Утренняя медитация',
    description: 'Начните день с гармонии и внутреннего спокойствия',
    cover_image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  },
  {
    title: 'Звуки природы',
    description: 'Музыка, вдохновлённая живой природой',
    cover_image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80',
  },
  {
    title: 'Для глубокого сна',
    description: 'Мелодии для крепкого и восстанавливающего сна',
    cover_image_url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80',
  },
  {
    title: 'Снятие тревоги',
    description: 'Мягкая музыка для снятия стресса и тревоги',
    cover_image_url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&q=80',
  },
  {
    title: 'Фортепиано и душа',
    description: 'Нежные фортепианные мелодии для вашей души',
    cover_image_url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80',
  },
  {
    title: 'Йога и растяжка',
    description: 'Фоновая музыка для практики йоги и растяжки',
    cover_image_url: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&q=80',
  },
  {
    title: 'Концентрация и фокус',
    description: 'Помогает сосредоточиться на работе и учёбе',
    cover_image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
  },
  {
    title: 'Дождь и гроза',
    description: 'Атмосферная музыка под шум дождя и грозы',
    cover_image_url: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&q=80',
  },
  {
    title: 'Классика для отдыха',
    description: 'Классические произведения для полного расслабления',
    cover_image_url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80',
  },
  {
    title: 'Бинауральные ритмы',
    description: 'Специальные частоты для медитации и расслабления',
    cover_image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80',
  },
  {
    title: 'Джаз и блюз',
    description: 'Мягкий джаз и блюз для вечернего расслабления',
    cover_image_url: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&q=80',
  },
  {
    title: 'Гитара у костра',
    description: 'Акустическая гитара и атмосфера уюта',
    cover_image_url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80',
  },
  {
    title: 'Осень и ностальгия',
    description: 'Меланхоличные мелодии для задумчивых вечеров',
    cover_image_url: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=400&q=80',
  },
  {
    title: 'Звуки океана',
    description: 'Шум волн и морская атмосфера для глубокого покоя',
    cover_image_url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80',
  },
  {
    title: 'Энергия и подъём',
    description: 'Позитивная музыка для хорошего настроения',
    cover_image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
  },
];

export const seedPlaylists = async (): Promise<void> => {
  try {
    let inserted = 0;
    let updated = 0;

    for (const pl of PLAYLISTS_SEED) {
      const existing = await pool.query(
        'SELECT id, cover_image_url FROM playlists WHERE title = $1',
        [pl.title],
      );

      if (existing.rows.length === 0) {
        await pool.query(
          'INSERT INTO playlists (title, description, cover_image_url, is_active) VALUES ($1, $2, $3, true)',
          [pl.title, pl.description, pl.cover_image_url],
        );
        inserted++;
      } else {
        await pool.query(
          `UPDATE playlists
           SET cover_image_url = $1, description = $2
           WHERE title = $3`,
          [pl.cover_image_url, pl.description, pl.title],
        );
        updated++;
      }
    }

    if (inserted > 0 || updated > 0) {
      console.log(` Плейлисты: +${inserted} добавлено, ${updated} обновлено`);
    }
  } catch (error) {
    console.error(' Ошибка при инициализации плейлистов:', error);
  }
};
