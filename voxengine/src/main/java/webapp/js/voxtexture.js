class Voxtexture {
    constructor(datas) {
        const stride = 4;
        const colorLen = datas.length / stride;
        const colors = [];
        for(let i = 0; i < colorLen; ++i) {
            let idx = i * stride;
            colors[i] = [
                datas[idx],
                datas[idx + 1],
                datas[idx + 2],
                datas[idx + 3]
            ];
        }
        
        /*
        // 冪乗変換テスト
        let test = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 10, 16, 31, 32, 33, 1000, 100000000, 256 * 256 * 256 * 256];
        for(let i = 0; i < test.length; ++i) {
            let size = this.toSquareSize(test[i]);
            let p2 = this.toPow2(size);
            console.log(test[i] + " -> " + size + " -> " + p2);
        }
        */
        this.usingColors = this.getJustUsingColors(colors);
        this.textureSize = Math.max(this.toPow2(this.toSquareSize(this.usingColors.length)), 2);
        this.colorUVMap = this.makeColorUVMap(this.usingColors, this.textureSize);
    };
    
    // pngフォーマットを出力　おつかれ　let constのwarningむかつくな　
    // いやうざい　そうかそうそうかそうかそうかそうか
    // 今どんな感じ？　おおすげえ　さっき100*100*100のobj落としたらブラウザメモリリークした(旧システム)
    // なんか指標ほしいね
    // それはある　100 * 100でかすぎ
    // スマホだと余裕で落ちる　いまやっとくか
    // 30 * 30 * 30 くらいに なおした いいかんじ
    // obj / mtl できてあとpngの出力ー
    // おおきめのobj落としたら60mぐらいあったわ
    // platformの大きさは調整したほうが良いかもしれないなー
    // あれでスケール感狂うというか
    exportPngFormat() {
        // 色情報をUint8Arrayに変換
        let data = new Uint8Array(this.textureSize * this.textureSize * 4);
        for(let i = 0; i < this.usingColors.length; ++i) {
            let idx = i * 4;
            data[idx] = this.usingColors[i][0];
            data[idx + 1] = this.usingColors[i][1];
            data[idx + 2] = this.usingColors[i][2];
            data[idx + 3] = this.usingColors[i][3];
        }
        
        // console.log(data);
        let pngEncoder = new CanvasTool.PngEncoder(data, {
            width: this.textureSize,
            height: this.textureSize
        });
        return pngEncoder.convert();
    };
    
    // 色情報を対応するuv値に変換
    color2UV(colorData) {
        return this.colorUVMap[colorData];
    };
    
    // x以上の最小の累乗値の低に変換
    toSquareSize(x) {
        let size = 1;
        while(x - (size * size) > 0) {
            ++size;
        }
        return size;
    };
    
    // x以上の最小の2の冪乗値の低に変換
    toPow2(x) {
        x--;
        x |= x >> 1;
        x |= x >> 2;
        x |= x >> 4;
        x |= x >> 8;
        x |= x >> 16;
        return ++x;
    };
    
    getJustUsingColors(colors) {
        const usingColors = [];
        for(let i = 0; i < colors.length; ++i) {
            if(!this.contains(usingColors, colors[i])) {
                usingColors.push(colors[i]);
            }
        }
        return usingColors;
    };
    
    contains(array, colorData) {
        for(let i = 0; i < array.length; ++i) {
            if(this.equalColorData(array[i], colorData)) {
                return true;
            }
        }
        return false;
    }
    
    equalColorData(a, b) {
        return (
            a[0] === b[0] &&
            a[1] === b[1] &&
            a[2] === b[2] &&
            a[3] === b[3]
        );
    }
    
    makeColorUVMap(colors, size) {
        let step = 1 / size;
        let halfStep = step * 0.5;
        let map = {};
        const cLen = colors.length;
        
        for(let y = 0; y < size; ++y) {
            for(let x = 0; x < size; ++x) {
                let idx = y * size + x;
                if(idx >= cLen) return map;
                // 画素値の中心を指す
                map[colors[idx]] = {
                    x: step * x + halfStep,
                    y: 1 - (step * y + halfStep)
                };
            }
        }
        return map;
    }
}