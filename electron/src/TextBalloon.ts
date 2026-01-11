class TextBalloon {
    constructor(private text: string, private duration: number = 2000) {}
    
    public show() {
        console.log(this.text);
    }
}