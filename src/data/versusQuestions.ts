export interface VersusQuestion {
  text: string;
  isNegative: boolean;
}

export const versusQuestions: VersusQuestion[] = [
  { text: "Siapa yang paling *sayang*?", isNegative: false },
  { text: "Siapa yang paling *cinta*?", isNegative: false },
  { text: "Siapa yang paling sering *ngambek*?", isNegative: true },
  { text: "Siapa yang paling *sabar*?", isNegative: false },
  { text: "Siapa yang paling *boros*?", isNegative: true },
  { text: "Siapa yang paling sering *kangen*?", isNegative: false },
  { text: "Siapa yang paling *lucu*?", isNegative: false },
  { text: "Siapa yang paling pinter *masak*?", isNegative: false },
  { text: "Siapa yang paling sering *telat*?", isNegative: true },
  { text: "Siapa yang paling *romantis*?", isNegative: false },
  { text: "Siapa yang paling *keras kepala*?", isNegative: true },
  { text: "Siapa yang paling *perhatian*?", isNegative: false },
  { text: "Siapa yang paling sering *tidur*?", isNegative: true },
  { text: "Siapa yang paling jago *nyanyi*?", isNegative: false },
  { text: "Siapa yang paling *cengeng*?", isNegative: true },
  { text: "Siapa yang paling sering *ngajak jalan*?", isNegative: false },
  { text: "Siapa yang paling *rapi*?", isNegative: false },
  { text: "Siapa yang paling *berantakan*?", isNegative: true },
  { text: "Siapa yang paling sering *lupa*?", isNegative: true },
  { text: "Siapa yang paling jago *main game*?", isNegative: false },
  { text: "Siapa yang paling sering *minta maaf* duluan?", isNegative: false },
  { text: "Siapa yang paling sering *cemburu*?", isNegative: true },
  { text: "Siapa yang paling *berani*?", isNegative: false },
  { text: "Siapa yang paling *penakut*?", isNegative: true },
  { text: "Siapa yang paling sering *dandan lama*?", isNegative: true },
];
