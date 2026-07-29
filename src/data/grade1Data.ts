import { UnitData } from '../types';

export const GRADE_1_UNITS: UnitData[] = [
  {
    id: 101,
    gradeLevel: 1,
    titleEn: 'Unit 1: In the school playground',
    titleVi: 'Bài 1: Trên sân trường',
    letterFocus: 'Bb',
    description: 'Học nhận biết chữ cái B, b (/b/), từ vựng và câu chào hỏi đơn giản',
    themeColor: 'from-amber-400 to-yellow-500',
    iconEmoji: '🛝',
    vocabularies: [
      { id: 'g1-u1-1', unitId: 101, word: 'ball', phonetic: '/bɔːl/', letter: 'B', vietnamese: 'quả bóng', exampleEn: 'This is a ball.', exampleVi: 'Đây là quả bóng.', emoji: '⚽', audioText: 'ball', difficulty: 'easy' },
      { id: 'g1-u1-2', unitId: 101, word: 'bike', phonetic: '/baɪk/', letter: 'B', vietnamese: 'xe đạp', exampleEn: 'I have a bike.', exampleVi: 'Tớ có một chiếc xe đạp.', emoji: '🚲', audioText: 'bike', difficulty: 'easy' },
      { id: 'g1-u1-3', unitId: 101, word: 'book', phonetic: '/bʊk/', letter: 'B', vietnamese: 'cuốn sách', exampleEn: 'Open your book.', exampleVi: 'Mở sách của bạn ra.', emoji: '📚', audioText: 'book', difficulty: 'easy' },
      { id: 'g1-u1-4', unitId: 101, word: 'Bill', phonetic: '/bɪl/', letter: 'B', vietnamese: 'bạn Bill', exampleEn: "Hi, I'm Bill.", exampleVi: 'Xin chào, tớ là Bill.', emoji: '👦', audioText: 'Bill', difficulty: 'easy' },
    ],
    quizzes: [
      { id: 'g1-q1-1', unitId: 101, type: 'multiple-choice', questionText: 'Từ "ball" có nghĩa là gì?', options: ['quả bóng ⚽', 'cuốn sách 📚', 'xe đạp 🚲'], correctAnswer: 'quả bóng ⚽', explanationVi: 'Ball là quả bóng.', emoji: '⚽' },
      { id: 'g1-q1-2', unitId: 101, type: 'multiple-choice', questionText: 'Mẫu câu chào hỏi tự giới thiệu tên:', options: ["Hi, I'm Bill. 👦", 'Bye, Bill. 👋', 'This is a ball. ⚽'], correctAnswer: "Hi, I'm Bill. 👦", explanationVi: "Hi, I'm Bill nghĩa là Xin chào, tớ là Bill.", emoji: '👦' },
      { id: 'g1-q1-3', unitId: 101, type: 'multiple-choice', questionText: 'Chọn từ chứa âm Bb nghĩa là "xe đạp":', options: ['bike 🚲', 'book 📚', 'ball ⚽'], correctAnswer: 'bike 🚲', explanationVi: 'Bike nghĩa là xe đạp.', emoji: '🚲' }
    ],
  },
  {
    id: 102,
    gradeLevel: 1,
    titleEn: 'Unit 2: In the dining room',
    titleVi: 'Bài 2: Trong phòng ăn',
    letterFocus: 'Cc',
    description: 'Học nhận biết chữ cái C, c (/k/) và tên đồ ăn, đồ vật trong phòng ăn',
    themeColor: 'from-pink-400 to-rose-500',
    iconEmoji: '🍽️',
    vocabularies: [
      { id: 'g1-u2-1', unitId: 102, word: 'cake', phonetic: '/keɪk/', letter: 'C', vietnamese: 'bánh ngọt', exampleEn: 'I have a cake.', exampleVi: 'Tớ có một chiếc bánh ngọt.', emoji: '🍰', audioText: 'cake', difficulty: 'easy' },
      { id: 'g1-u2-2', unitId: 102, word: 'car', phonetic: '/kɑːr/', letter: 'C', vietnamese: 'ô tô đồ chơi', exampleEn: 'I have a car.', exampleVi: 'Tớ có một chiếc ô tô.', emoji: '🚗', audioText: 'car', difficulty: 'easy' },
      { id: 'g1-u2-3', unitId: 102, word: 'cat', phonetic: '/kæt/', letter: 'C', vietnamese: 'con mèo', exampleEn: 'I have a cat.', exampleVi: 'Tớ có một con mèo.', emoji: '🐱', audioText: 'cat', difficulty: 'easy' },
      { id: 'g1-u2-4', unitId: 102, word: 'cup', phonetic: '/kʌp/', letter: 'C', vietnamese: 'cái cốc', exampleEn: 'I have a cup.', exampleVi: 'Tớ có cái cốc.', emoji: '🥛', audioText: 'cup', difficulty: 'easy' },
    ],
    quizzes: [
      { id: 'g1-q2-1', unitId: 102, type: 'multiple-choice', questionText: 'Nói "Tớ có một chiếc ô tô" bằng tiếng Anh:', options: ['I have a car. 🚗', 'I have a cat. 🐱', 'I have a cake. 🍰'], correctAnswer: 'I have a car. 🚗', explanationVi: 'Car là ô tô.', emoji: '🚗' },
      { id: 'g1-q2-2', unitId: 102, type: 'multiple-choice', questionText: 'Từ "cake" nghĩa là gì?', options: ['bánh ngọt 🍰', 'cái cốc 🥛', 'con mèo 🐱'], correctAnswer: 'bánh ngọt 🍰', explanationVi: 'Cake là bánh ngọt.', emoji: '🍰' }
    ],
  },
  {
    id: 103,
    gradeLevel: 1,
    titleEn: 'Unit 3: At the street market',
    titleVi: 'Bài 3: Tại chợ đường phố',
    letterFocus: 'Aa',
    description: 'Học nhận biết chữ cái A, a (/æ/) và từ vựng đồ dùng mua ở chợ',
    themeColor: 'from-blue-400 to-indigo-500',
    iconEmoji: '🏪',
    vocabularies: [
      { id: 'g1-u3-1', unitId: 103, word: 'apple', phonetic: '/ˈæp.əl/', letter: 'A', vietnamese: 'quả táo', exampleEn: 'This is my apple.', exampleVi: 'Đây là quả táo của tớ.', emoji: '🍎', audioText: 'apple', difficulty: 'easy' },
      { id: 'g1-u3-2', unitId: 103, word: 'bag', phonetic: '/bæɡ/', letter: 'A', vietnamese: 'cặp sách / cái túi', exampleEn: 'This is my bag.', exampleVi: 'Đây là cái cặp của tớ.', emoji: '🎒', audioText: 'bag', difficulty: 'easy' },
      { id: 'g1-u3-3', unitId: 103, word: 'can', phonetic: '/kæn/', letter: 'A', vietnamese: 'lon nước', exampleEn: 'This is my can.', exampleVi: 'Đây là lon nước của tớ.', emoji: '🥫', audioText: 'can', difficulty: 'easy' },
      { id: 'g1-u3-4', unitId: 103, word: 'hat', phonetic: '/hæt/', letter: 'A', vietnamese: 'cái mũ', exampleEn: 'This is my hat.', exampleVi: 'Đây là cái mũ của tớ.', emoji: '🧢', audioText: 'hat', difficulty: 'easy' },
    ],
    quizzes: [
      { id: 'g1-q3-1', unitId: 103, type: 'multiple-choice', questionText: 'Muốn nói "Đây là cái cặp của tớ":', options: ['This is my bag. 🎒', 'This is my apple. 🍎', 'This is my hat. 🧢'], correctAnswer: 'This is my bag. 🎒', explanationVi: 'Bag là cái cặp/túi.', emoji: '🎒' },
    ],
  },
  {
    id: 104,
    gradeLevel: 1,
    titleEn: 'Unit 4: In the bedroom',
    titleVi: 'Bài 4: Trong phòng ngủ',
    letterFocus: 'Dd',
    description: 'Học nhận biết chữ cái D, d (/d/) và các vật dụng trong phòng ngủ',
    themeColor: 'from-purple-400 to-pink-500',
    iconEmoji: '🛏️',
    vocabularies: [
      { id: 'g1-u4-1', unitId: 104, word: 'desk', phonetic: '/desk/', letter: 'D', vietnamese: 'bàn học', exampleEn: 'This is a desk.', exampleVi: 'Đây là bàn học.', emoji: '🪑', audioText: 'desk', difficulty: 'easy' },
      { id: 'g1-u4-2', unitId: 104, word: 'dog', phonetic: '/dɒɡ/', letter: 'D', vietnamese: 'con chó', exampleEn: 'This is a dog.', exampleVi: 'Đây là con chó.', emoji: '🐶', audioText: 'dog', difficulty: 'easy' },
      { id: 'g1-u4-3', unitId: 104, word: 'door', phonetic: '/dɔːr/', letter: 'D', vietnamese: 'cánh cửa', exampleEn: 'This is a door.', exampleVi: 'Đây là cánh cửa.', emoji: '🚪', audioText: 'door', difficulty: 'easy' },
      { id: 'g1-u4-4', unitId: 104, word: 'duck', phonetic: '/dʌk/', letter: 'D', vietnamese: 'con vịt', exampleEn: 'This is a duck.', exampleVi: 'Đây là con vịt.', emoji: '🦆', audioText: 'duck', difficulty: 'easy' },
    ],
    quizzes: [
      { id: 'g1-q4-1', unitId: 104, type: 'multiple-choice', questionText: 'Từ "door" có nghĩa là gì?', options: ['cánh cửa 🚪', 'bàn học 🪑', 'con vịt 🦆'], correctAnswer: 'cánh cửa 🚪', explanationVi: 'Door là cánh cửa.', emoji: '🚪' }
    ],
  },
  {
    id: 105,
    gradeLevel: 1,
    titleEn: 'Unit 5: At the fish and chip shop',
    titleVi: 'Bài 5: Tại cửa hàng cá và khoai tây chiên',
    letterFocus: 'Ii',
    description: 'Học nhận biết chữ cái I, i (/ɪ/) và món ăn ngon miệng',
    themeColor: 'from-emerald-400 to-teal-600',
    iconEmoji: '🍟',
    vocabularies: [
      { id: 'g1-u5-1', unitId: 105, word: 'chicken', phonetic: '/ˈtʃɪk.ɪn/', letter: 'I', vietnamese: 'thịt gà', exampleEn: 'I like chicken.', exampleVi: 'Tớ thích thịt gà.', emoji: '🍗', audioText: 'chicken', difficulty: 'easy' },
      { id: 'g1-u5-2', unitId: 105, word: 'chips', phonetic: '/tʃɪps/', letter: 'I', vietnamese: 'khoai tây chiên', exampleEn: 'I like chips.', exampleVi: 'Tớ thích khoai tây chiên.', emoji: '🍟', audioText: 'chips', difficulty: 'easy' },
      { id: 'g1-u5-3', unitId: 105, word: 'fish', phonetic: '/fɪʃ/', letter: 'I', vietnamese: 'con cá / món cá', exampleEn: 'I like fish.', exampleVi: 'Tớ thích món cá.', emoji: '🐟', audioText: 'fish', difficulty: 'easy' },
      { id: 'g1-u5-4', unitId: 105, word: 'milk', phonetic: '/mɪlk/', letter: 'I', vietnamese: 'sữa tươi', exampleEn: 'I like milk.', exampleVi: 'Tớ thích sữa tươi.', emoji: '🥛', audioText: 'milk', difficulty: 'easy' },
    ],
    quizzes: [
      { id: 'g1-q5-1', unitId: 105, type: 'multiple-choice', questionText: 'Dịch câu "I like milk.":', options: ['Tớ thích sữa tươi. 🥛', 'Tớ thích khoai tây chiên. 🍟', 'Tớ thích thịt gà. 🍗'], correctAnswer: 'Tớ thích sữa tươi. 🥛', explanationVi: 'Milk là sữa tươi.', emoji: '🥛' }
    ],
  },
  {
    id: 106,
    gradeLevel: 1,
    titleEn: 'Unit 6: In the classroom',
    titleVi: 'Bài 6: Trong lớp học',
    letterFocus: 'Ee',
    description: 'Học nhận biết chữ cái E, e (/e/) và các đồ dùng lớp học',
    themeColor: 'from-yellow-400 to-amber-500',
    iconEmoji: '🏫',
    vocabularies: [
      { id: 'g1-u6-1', unitId: 106, word: 'bell', phonetic: '/bel/', letter: 'E', vietnamese: 'cái chuông', exampleEn: 'Listen to the bell.', exampleVi: 'Lắng nghe tiếng chuông.', emoji: '🔔', audioText: 'bell', difficulty: 'easy' },
      { id: 'g1-u6-2', unitId: 106, word: 'pen', phonetic: '/pen/', letter: 'E', vietnamese: 'cái bút mực', exampleEn: "It's a red pen.", exampleVi: 'Đó là một cái bút mực màu đỏ.', emoji: '🖊️', audioText: 'pen', difficulty: 'easy' },
      { id: 'g1-u6-3', unitId: 106, word: 'pencil', phonetic: '/ˈpen.səl/', letter: 'E', vietnamese: 'cái bút chì', exampleEn: "It's a pencil.", exampleVi: 'Đó là cái bút chì.', emoji: '✏️', audioText: 'pencil', difficulty: 'easy' },
      { id: 'g1-u6-4', unitId: 106, word: 'red', phonetic: '/red/', letter: 'E', vietnamese: 'màu đỏ', exampleEn: "It's red.", exampleVi: 'Nó màu đỏ.', emoji: '🔴', audioText: 'red', difficulty: 'easy' },
    ],
    quizzes: [
      { id: 'g1-q6-1', unitId: 106, type: 'multiple-choice', questionText: 'Mẫu câu "It\'s a red pen." nghĩa là gì?', options: ['Đó là một cái bút mực màu đỏ. 🖊️', 'Đó là một cái bút chì. ✏️', 'Lắng nghe tiếng chuông. 🔔'], correctAnswer: 'Đó là một cái bút mực màu đỏ. 🖊️', explanationVi: 'Red pen là bút mực màu đỏ.', emoji: '🖊️' }
    ],
  },
  {
    id: 107,
    gradeLevel: 1,
    titleEn: 'Unit 7: In the garden',
    titleVi: 'Bài 7: Trong vườn',
    letterFocus: 'Gg',
    description: 'Học nhận biết chữ cái G, g (/ɡ/) và khung cảnh khu vườn',
    themeColor: 'from-teal-400 to-emerald-500',
    iconEmoji: '🏡',
    vocabularies: [
      { id: 'g1-u7-1', unitId: 107, word: 'garden', phonetic: '/ˈɡɑː.dən/', letter: 'G', vietnamese: 'khu vườn', exampleEn: "There's a garden.", exampleVi: 'Có một khu vườn.', emoji: '🏡', audioText: 'garden', difficulty: 'easy' },
      { id: 'g1-u7-2', unitId: 107, word: 'gate', phonetic: '/ɡeɪt/', letter: 'G', vietnamese: 'cái cổng', exampleEn: "There's a gate.", exampleVi: 'Có một cái cổng.', emoji: '🚪', audioText: 'gate', difficulty: 'easy' },
      { id: 'g1-u7-3', unitId: 107, word: 'girl', phonetic: '/ɡɜːl/', letter: 'G', vietnamese: 'cô bé / bạn gái', exampleEn: "There's a girl.", exampleVi: 'Có một cô bé.', emoji: '👧', audioText: 'girl', difficulty: 'easy' },
      { id: 'g1-u7-4', unitId: 107, word: 'goat', phonetic: '/ɡəʊt/', letter: 'G', vietnamese: 'con dê', exampleEn: "There's a goat.", exampleVi: 'Có một con dê.', emoji: '🐐', audioText: 'goat', difficulty: 'easy' },
    ],
    quizzes: [
      { id: 'g1-q7-1', unitId: 107, type: 'multiple-choice', questionText: 'Nói "Có một con dê" bằng tiếng Anh:', options: ["There's a goat. 🐐", "There's a garden. 🏡", "There's a gate. 🚪"], correctAnswer: "There's a goat. 🐐", explanationVi: 'Goat là con dê.', emoji: '🐐' }
    ],
  },
  {
    id: 108,
    gradeLevel: 1,
    titleEn: 'Unit 8: In the park',
    titleVi: 'Bài 8: Trong công viên',
    letterFocus: 'Hh',
    description: 'Học nhận biết chữ cái H, h (/h/) và bộ phận cơ thể, con vật',
    themeColor: 'from-sky-400 to-blue-500',
    iconEmoji: '🌳',
    vocabularies: [
      { id: 'g1-u8-1', unitId: 108, word: 'hair', phonetic: '/heər/', letter: 'H', vietnamese: 'mái tóc', exampleEn: 'Touch your hair.', exampleVi: 'Hãy chạm vào tóc bạn.', emoji: '💇', audioText: 'hair', difficulty: 'easy' },
      { id: 'g1-u8-2', unitId: 108, word: 'hand', phonetic: '/hænd/', letter: 'H', vietnamese: 'bàn tay', exampleEn: 'Touch your hand.', exampleVi: 'Hãy chạm vào bàn tay.', emoji: '✋', audioText: 'hand', difficulty: 'easy' },
      { id: 'g1-u8-3', unitId: 108, word: 'head', phonetic: '/hed/', letter: 'H', vietnamese: 'cái đầu', exampleEn: 'Touch your head.', exampleVi: 'Hãy chạm vào đầu bạn.', emoji: '🧑', audioText: 'head', difficulty: 'easy' },
      { id: 'g1-u8-4', unitId: 108, word: 'horse', phonetic: '/hɔːs/', letter: 'H', vietnamese: 'con ngựa', exampleEn: 'Look at the horse.', exampleVi: 'Nhìn con ngựa kìa.', emoji: '🐎', audioText: 'horse', difficulty: 'easy' },
    ],
    quizzes: [
      { id: 'g1-q8-1', unitId: 108, type: 'multiple-choice', questionText: 'Yêu cầu "Touch your hair." có nghĩa là gì?', options: ['Chạm vào tóc của bạn 💇', 'Chạm vào tay của bạn ✋', 'Chạm vào đầu của bạn 🧑'], correctAnswer: 'Chạm vào tóc của bạn 💇', explanationVi: 'Hair là mái tóc.', emoji: '💇' }
    ],
  },
  {
    id: 109,
    gradeLevel: 1,
    titleEn: 'Unit 9: In the shop',
    titleVi: 'Bài 9: Trong cửa hàng',
    letterFocus: 'Oo',
    description: 'Học nhận biết chữ cái O, o (/ɒ/) và hỏi đếm số lượng đồ vật',
    themeColor: 'from-orange-400 to-amber-500',
    iconEmoji: '🛍️',
    vocabularies: [
      { id: 'g1-u9-1', unitId: 109, word: 'clocks', phonetic: '/klɒks/', letter: 'O', vietnamese: 'những cái đồng hồ', exampleEn: 'How many clocks? Two.', exampleVi: 'Có mấy cái đồng hồ? Hai cái.', emoji: '⏰', audioText: 'clocks', difficulty: 'easy' },
      { id: 'g1-u9-2', unitId: 109, word: 'locks', phonetic: '/lɒks/', letter: 'O', vietnamese: 'những ổ khóa', exampleEn: 'How many locks? Three.', exampleVi: 'Có mấy ổ khóa? Ba cái.', emoji: '🔒', audioText: 'locks', difficulty: 'easy' },
      { id: 'g1-u9-3', unitId: 109, word: 'mops', phonetic: '/mɒps/', letter: 'O', vietnamese: 'những cây lau nhà', exampleEn: 'How many mops? Four.', exampleVi: 'Có mấy cây lau nhà? Bốn cái.', emoji: '🧹', audioText: 'mops', difficulty: 'easy' },
      { id: 'g1-u9-4', unitId: 109, word: 'pots', phonetic: '/pɒts/', letter: 'O', vietnamese: 'những cái nồi', exampleEn: 'How many pots? Two.', exampleVi: 'Có mấy cái nồi? Hai cái.', emoji: '🍲', audioText: 'pots', difficulty: 'easy' },
    ],
    quizzes: [
      { id: 'g1-q9-1', unitId: 109, type: 'multiple-choice', questionText: 'Hỏi số lượng đồng hồ: "How many clocks?" - Trả lời 2 cái:', options: ['Two ⏰', 'Three 🔒', 'Four 🧹'], correctAnswer: 'Two ⏰', explanationVi: 'Two nghĩa là 2.', emoji: '⏰' }
    ],
  },
  {
    id: 110,
    gradeLevel: 1,
    titleEn: 'Unit 10: At the zoo',
    titleVi: 'Bài 10: Ở sở thú',
    letterFocus: 'Mm',
    description: 'Học nhận biết chữ cái M, m (/m/) và quan sát con vật sở thú',
    themeColor: 'from-lime-400 to-green-500',
    iconEmoji: '🦁',
    vocabularies: [
      { id: 'g1-u10-1', unitId: 110, word: 'mango', phonetic: '/ˈmæŋ.ɡəʊ/', letter: 'M', vietnamese: 'quả xoài', exampleEn: "That's a mango.", exampleVi: 'Đó là một quả xoài.', emoji: '🥭', audioText: 'mango', difficulty: 'easy' },
      { id: 'g1-u10-2', unitId: 110, word: 'monkey', phonetic: '/ˈmʌŋ.ki/', letter: 'M', vietnamese: 'con khỉ', exampleEn: "That's a monkey.", exampleVi: 'Đó là một con khỉ.', emoji: '🐒', audioText: 'monkey', difficulty: 'easy' },
      { id: 'g1-u10-3', unitId: 110, word: 'mother', phonetic: '/ˈmʌð.ər/', letter: 'M', vietnamese: 'mẹ', exampleEn: "That's my mother.", exampleVi: 'Đó là mẹ của tớ.', emoji: '👩', audioText: 'mother', difficulty: 'easy' },
      { id: 'g1-u10-4', unitId: 110, word: 'mouse', phonetic: '/maʊs/', letter: 'M', vietnamese: 'con chuột', exampleEn: "That's a mouse.", exampleVi: 'Đó là một con chuột.', emoji: '🐭', audioText: 'mouse', difficulty: 'easy' },
    ],
    quizzes: [
      { id: 'g1-q10-1', unitId: 110, type: 'multiple-choice', questionText: 'Dịch "That\'s a monkey.":', options: ['Đó là một con khỉ. 🐒', 'Đó là một quả xoài. 🥭', 'Đó là một con chuột. 🐭'], correctAnswer: 'Đó là một con khỉ. 🐒', explanationVi: 'Monkey là con khỉ.', emoji: '🐒' }
    ],
  },
  {
    id: 111,
    gradeLevel: 1,
    titleEn: 'Unit 11: At the bus stop',
    titleVi: 'Bài 11: Tại trạm xe buýt',
    letterFocus: 'Uu',
    description: 'Học nhận biết chữ cái U, u (/ʌ/) và nói về hành động',
    themeColor: 'from-pink-500 to-rose-600',
    iconEmoji: '🚏',
    vocabularies: [
      { id: 'g1-u11-1', unitId: 111, word: 'bus', phonetic: '/bʌs/', letter: 'U', vietnamese: 'xe buýt', exampleEn: 'Look at the bus.', exampleVi: 'Nhìn chiếc xe buýt kìa.', emoji: '🚌', audioText: 'bus', difficulty: 'easy' },
      { id: 'g1-u11-2', unitId: 111, word: 'run', phonetic: '/rʌn/', letter: 'U', vietnamese: 'chạy', exampleEn: "She's running.", exampleVi: 'Cô ấy đang chạy.', emoji: '🏃', audioText: 'run', difficulty: 'easy' },
      { id: 'g1-u11-3', unitId: 111, word: 'sun', phonetic: '/sʌn/', letter: 'U', vietnamese: 'mặt trời', exampleEn: 'Look at the sun.', exampleVi: 'Nhìn mặt trời kìa.', emoji: '☀️', audioText: 'sun', difficulty: 'easy' },
      { id: 'g1-u11-4', unitId: 111, word: 'truck', phonetic: '/trʌk/', letter: 'U', vietnamese: 'xe tải', exampleEn: 'That is a truck.', exampleVi: 'Đó là chiếc xe tải.', emoji: '🚚', audioText: 'truck', difficulty: 'easy' },
    ],
    quizzes: [
      { id: 'g1-q11-1', unitId: 111, type: 'multiple-choice', questionText: 'Nói "Cô ấy đang chạy" trong tiếng Anh:', options: ["She's running. 🏃", "He's running. 🏃‍♂️", 'Look at the bus. 🚌'], correctAnswer: "She's running. 🏃", explanationVi: "She's running nghĩa là cô ấy đang chạy.", emoji: '🏃' }
    ],
  },
  {
    id: 112,
    gradeLevel: 1,
    titleEn: 'Unit 12: At the lake',
    titleVi: 'Bài 12: Ở hồ nước',
    letterFocus: 'Ll',
    description: 'Học nhận biết chữ cái L, l (/l/) và khung cảnh hồ nước',
    themeColor: 'from-emerald-500 to-teal-600',
    iconEmoji: '🌊',
    vocabularies: [
      { id: 'g1-u12-1', unitId: 112, word: 'lake', phonetic: '/leɪk/', letter: 'L', vietnamese: 'hồ nước', exampleEn: 'Look at the lake.', exampleVi: 'Nhìn hồ nước kìa.', emoji: '🏞️', audioText: 'lake', difficulty: 'easy' },
      { id: 'g1-u12-2', unitId: 112, word: 'leaf', phonetic: '/liːf/', letter: 'L', vietnamese: 'chiếc lá', exampleEn: 'Look at the leaf.', exampleVi: 'Nhìn chiếc lá kìa.', emoji: '🍃', audioText: 'leaf', difficulty: 'easy' },
      { id: 'g1-u12-3', unitId: 112, word: 'lemons', phonetic: '/ˈlem.ənz/', letter: 'L', vietnamese: 'những quả chanh', exampleEn: 'Look at the lemons.', exampleVi: 'Nhìn những quả chanh kìa.', emoji: '🍋', audioText: 'lemons', difficulty: 'easy' },
    ],
    quizzes: [
      { id: 'g1-q12-1', unitId: 112, type: 'multiple-choice', questionText: 'Từ "lemons" trong câu "Look at the lemons." nghĩa là gì?', options: ['những quả chanh 🍋', 'chiếc lá 🍃', 'hồ nước 🏞️'], correctAnswer: 'những quả chanh 🍋', explanationVi: 'Lemons là những quả chanh.', emoji: '🍋' }
    ],
  },
  {
    id: 113,
    gradeLevel: 1,
    titleEn: 'Unit 13: In the school canteen',
    titleVi: 'Bài 13: Trong căn tin trường',
    letterFocus: 'Nn',
    description: 'Học nhận biết chữ cái N, n (/n/) và tên món ăn căn tin',
    themeColor: 'from-violet-400 to-purple-600',
    iconEmoji: '🥪',
    vocabularies: [
      { id: 'g1-u13-1', unitId: 113, word: 'bananas', phonetic: '/bəˈnɑː.nəz/', letter: 'N', vietnamese: 'những quả chuối', exampleEn: "She's having bananas.", exampleVi: 'Cô ấy đang ăn chuối.', emoji: '🍌', audioText: 'bananas', difficulty: 'easy' },
      { id: 'g1-u13-2', unitId: 113, word: 'noodles', phonetic: '/ˈnuː.dəlz/', letter: 'N', vietnamese: 'món mì / phở', exampleEn: "She's having noodles.", exampleVi: 'Cô ấy đang ăn mì.', emoji: '🍜', audioText: 'noodles', difficulty: 'easy' },
      { id: 'g1-u13-3', unitId: 113, word: 'nuts', phonetic: '/nʌts/', letter: 'N', vietnamese: 'những hạt dẻ', exampleEn: "He's having nuts.", exampleVi: 'Cậu ấy đang ăn hạt.', emoji: '🥜', audioText: 'nuts', difficulty: 'easy' },
    ],
    quizzes: [
      { id: 'g1-q13-1', unitId: 113, type: 'multiple-choice', questionText: 'Dịch câu "She\'s having noodles.":', options: ['Cô ấy đang ăn mì. 🍜', 'Cô ấy đang ăn chuối. 🍌', 'Cậu ấy đang ăn hạt. 🥜'], correctAnswer: 'Cô ấy đang ăn mì. 🍜', explanationVi: 'Noodles là món mì/phở.', emoji: '🍜' }
    ],
  },
  {
    id: 114,
    gradeLevel: 1,
    titleEn: 'Unit 14: In the toy shop',
    titleVi: 'Bài 14: Trong cửa hàng đồ chơi',
    letterFocus: 'Tt',
    description: 'Học nhận biết chữ cái T, t (/t/) và các món đồ chơi',
    themeColor: 'from-amber-400 to-orange-500',
    iconEmoji: '🧸',
    vocabularies: [
      { id: 'g1-u14-1', unitId: 114, word: 'teddy bear', phonetic: '/ˈted.i beər/', letter: 'T', vietnamese: 'gấu bông', exampleEn: 'I can see a teddy bear.', exampleVi: 'Tớ có thể nhìn thấy gấu bông.', emoji: '🧸', audioText: 'teddy bear', difficulty: 'easy' },
      { id: 'g1-u14-2', unitId: 114, word: 'tiger', phonetic: '/ˈtaɪ.ɡər/', letter: 'T', vietnamese: 'con hổ', exampleEn: 'I can see a tiger.', exampleVi: 'Tớ có thể nhìn thấy con hổ.', emoji: '🐅', audioText: 'tiger', difficulty: 'easy' },
      { id: 'g1-u14-3', unitId: 114, word: 'top', phonetic: '/tɒp/', letter: 'T', vietnamese: 'con quay đồ chơi', exampleEn: 'I can see a top.', exampleVi: 'Tớ có thể nhìn thấy con quay.', emoji: '🪀', audioText: 'top', difficulty: 'easy' },
      { id: 'g1-u14-4', unitId: 114, word: 'turtle', phonetic: '/ˈtɜː.təl/', letter: 'T', vietnamese: 'con rùa', exampleEn: 'I can see a turtle.', exampleVi: 'Tớ có thể nhìn thấy con rùa.', emoji: '🐢', audioText: 'turtle', difficulty: 'easy' },
    ],
    quizzes: [
      { id: 'g1-q14-1', unitId: 114, type: 'multiple-choice', questionText: 'Mẫu câu "I can see a tiger." nghĩa là gì?', options: ['Tớ có thể nhìn thấy con hổ. 🐅', 'Tớ có thể nhìn thấy gấu bông. 🧸', 'Tớ có thể nhìn thấy con rùa. 🐢'], correctAnswer: 'Tớ có thể nhìn thấy con hổ. 🐅', explanationVi: 'Tiger là con hổ.', emoji: '🐅' }
    ],
  },
  {
    id: 115,
    gradeLevel: 1,
    titleEn: 'Unit 15: At the football match',
    titleVi: 'Bài 15: Tại trận đấu bóng đá',
    letterFocus: 'Ff',
    description: 'Học nhận biết chữ cái F, f (/f/) và các bộ phận cơ thể',
    themeColor: 'from-cyan-400 to-blue-500',
    iconEmoji: '⚽',
    vocabularies: [
      { id: 'g1-u15-1', unitId: 115, word: 'face', phonetic: '/feɪs/', letter: 'F', vietnamese: 'khuôn mặt', exampleEn: 'Point to your face.', exampleVi: 'Chỉ vào khuôn mặt của bạn.', emoji: '👧', audioText: 'face', difficulty: 'easy' },
      { id: 'g1-u15-2', unitId: 115, word: 'father', phonetic: '/ˈfɑː.ðər/', letter: 'F', vietnamese: 'bố', exampleEn: 'Look at my father.', exampleVi: 'Nhìn bố của tớ kìa.', emoji: '👨', audioText: 'father', difficulty: 'easy' },
      { id: 'g1-u15-3', unitId: 115, word: 'foot', phonetic: '/fʊt/', letter: 'F', vietnamese: 'bàn chân', exampleEn: 'Point to your foot.', exampleVi: 'Chỉ vào bàn chân của bạn.', emoji: '🦶', audioText: 'foot', difficulty: 'easy' },
      { id: 'g1-u15-4', unitId: 115, word: 'football', phonetic: '/ˈfʊt.bɔːl/', letter: 'F', vietnamese: 'quả bóng đá', exampleEn: "Let's play football.", exampleVi: 'Cùng chơi bóng đá nào.', emoji: '⚽', audioText: 'football', difficulty: 'easy' },
    ],
    quizzes: [
      { id: 'g1-q15-1', unitId: 115, type: 'multiple-choice', questionText: 'Hành động "Point to your hand." có nghĩa là:', options: ['Chỉ vào bàn tay của bạn. ✋', 'Chỉ vào khuôn mặt của bạn. 👧', 'Chỉ vào bàn chân của bạn. 🦶'], correctAnswer: 'Chỉ vào bàn tay của bạn. ✋', explanationVi: 'Hand là bàn tay.', emoji: '✋' }
    ],
  },
  {
    id: 116,
    gradeLevel: 1,
    titleEn: 'Unit 16: At home',
    titleVi: 'Bài 16: Ở nhà',
    letterFocus: 'Ww',
    description: 'Học nhận biết chữ cái W, w (/w/) và đếm đồ vật trong nhà',
    themeColor: 'from-fuchsia-400 to-purple-600',
    iconEmoji: '🏠',
    vocabularies: [
      { id: 'g1-u16-1', unitId: 116, word: 'wash', phonetic: '/wɒʃ/', letter: 'W', vietnamese: 'rửa / giặt', exampleEn: 'Wash your hands.', exampleVi: 'Rửa tay của bạn.', emoji: '🧼', audioText: 'wash', difficulty: 'easy' },
      { id: 'g1-u16-2', unitId: 116, word: 'water', phonetic: '/ˈwɔː.tər/', letter: 'W', vietnamese: 'nước uống', exampleEn: 'Drink some water.', exampleVi: 'Uống một chút nước.', emoji: '💧', audioText: 'water', difficulty: 'easy' },
      { id: 'g1-u16-3', unitId: 116, word: 'window', phonetic: '/ˈwɪn.dəʊ/', letter: 'W', vietnamese: 'cửa sổ', exampleEn: 'How many windows can you see? I can see six.', exampleVi: 'Bạn nhìn thấy mấy cửa sổ? Tớ thấy 6 cái.', emoji: '🪟', audioText: 'window', difficulty: 'easy' },
    ],
    quizzes: [
      { id: 'g1-q16-1', unitId: 116, type: 'multiple-choice', questionText: 'Hỏi "How many windows can you see?" - Trả lời 6 cái:', options: ['I can see six. 🪟', 'I can see five. 🪟', 'I can see four. 🪟'], correctAnswer: 'I can see six. 🪟', explanationVi: 'Six là số 6.', emoji: '🪟' }
    ],
  },
];
