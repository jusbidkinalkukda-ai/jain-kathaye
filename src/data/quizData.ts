export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  relatedBookId: string;
}

export const JAIN_QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'भगवान महावीर का जन्म किस पावन नगरी में हुआ था?',
    options: ['अयोध्या', 'कुण्डलपूर', 'वाराणसी', 'हस्तिनापुर'],
    correctAnswer: 1,
    explanation: 'भगवान महावीर का जन्म कुण्डलपूर के राजा सिद्धार्थ और महारानी त्रिशला के घर चैत्र शुक्ल त्रयोदशी को हुआ था।',
    relatedBookId: 'mahavira-charitra',
  },
  {
    id: 'q2',
    question: 'भगवान पार्श्वनाथ ने पंचाग्नि तप में किन जीवों की रक्षा की थी?',
    options: ['हिरण', 'मछली', 'सर्प-युगल (नाग-नागिन)', 'कबूतर'],
    correctAnswer: 2,
    explanation: 'प्रभु पार्श्वनाथ ने जलती लकड़ी से नाग-नागिन के जोड़े को णमोकार मंत्र सुनाकर बचाया, जो आगे चलकर धरणेन्द्र व पद्मावती बने।',
    relatedBookId: 'parshvanath-kamath',
  },
  {
    id: 'q3',
    question: 'अक्षय तृतीया का पावन पर्व किस ऐतिहासिक घटना से जुड़ा है?',
    options: [
      'भगवान महावीर का निर्वाण',
      'भगवान ऋषभदेव का प्रथम इक्षुरस पारणा',
      'सम्मेद शिखर जी की स्थापना',
      'समवशरण की प्रथम रचना'
    ],
    correctAnswer: 1,
    explanation: 'एक वर्ष के उपवास के पश्चात हस्तिनापुर में राजा श्रेयांस ने प्रभु ऋषभदेव को गन्ने के रस (इक्षुरस) का प्रथम आहार बहराया था।',
    relatedBookId: 'rishabhdev-charitra',
  },
  {
    id: 'q4',
    question: 'प्रभु महावीर ने सती चन्दनबाला के हाथ से किसका पारणा स्वीकार किया था?',
    options: ['खीर', 'उड़द के बाकुले', 'मिष्ठान्न', 'फल का रस'],
    correctAnswer: 1,
    explanation: 'प्रभु महावीर ने चन्दनबाला के निश्चल भाव और आंसुओं को देखकर सूपड़े में रखे उड़द के बाकुले का आहार ग्रहण किया था।',
    relatedBookId: 'chandanbala-katha',
  },
  {
    id: 'q5',
    question: 'जैन दर्शन में "अनेकांतवाद" का क्या अर्थ है?',
    options: [
      'केवल एक ही मत को सही मानना',
      'सत्य को विविध दृष्टिकोणों से समझना व सम्मान देना',
      'मौन रहना',
      'तपस्या करना'
    ],
    correctAnswer: 1,
    explanation: 'अनेकांतवाद सिखाता है कि सत्य के अनेक पहलू होते हैं और प्रत्येक दृष्टिकोण का सम्मान करना चाहिए।',
    relatedBookId: 'mahavira-charitra',
  },
];
