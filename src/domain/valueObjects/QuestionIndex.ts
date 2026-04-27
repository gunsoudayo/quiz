export class QuestionIndex {
  constructor(private readonly rawValue: number) {
    if (!Number.isInteger(rawValue) || rawValue < 0) {
      throw new Error("Question index must be a non-negative integer.");
    }
  }

  get value(): number {
    return this.rawValue;
  }

  isWaiting(): boolean {
    return this.rawValue === 0;
  }

  equals(other: QuestionIndex): boolean {
    return this.rawValue === other.rawValue;
  }
}
