export class Sleep{
    static delayProcessing(seconds: number): Promise<void>{
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve();
            }, seconds * 1000);
        });
    }
}