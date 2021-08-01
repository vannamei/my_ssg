import '../scss/main.scss'

export class Person {
  constructor(public readonly name: string, public age: number) {}

  public greeting(this: Person): void {
    console.log(`私の名前は${this.name}です。 年齢は${this.age}歳です。`)
  }

  public getOld(this: Person): void {
    this.age += 1
  }
}

export class Teacher extends Person {
  constructor(name: string, age: number, public subject: string) {
    super(name, age)
  }
}

const person1 = new Teacher('sato', 15, 'Mathmatics')
person1.greeting()
