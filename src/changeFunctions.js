function RealToInt(a, b, l, x) {
    return parseInt(Math.floor((1 / parseFloat((b - a))) * (x - a) * (Math.pow(2, l) - 1)));
}
function IntToBin(x, l) {
    return (x.toString(2).padStart(l, '0'));
}
function BinToInt(x) {
    return parseInt(x, 2);
}
function IntToReal(a, b, l, x) {
    let i = (x * (b - a)) / (Math.pow(2, l) - 1) + parseInt(a);
    return  i;
}
function genX(a, b, d) {
    return round((Math.floor(Math.random() * (Math.floor(b * (1 / d)) - Math.ceil(a * (1 / d)) + 1) + Math.ceil(a * (1 / d)))) / (1 / d), d);
}
function f(x) {
    return ((x % 1) * (Math.cos(20 * Math.PI * x)) - (Math.sin(x)));
}
export function colLptoFx(a, b, d, n) {
    let result = [];
    for (let i = 1; i <= n; ++i) {
        result.push(calculateTableRow(a, b, d, i));
    }
    return result;
}
export function colLptoGx(fxTab, d, dir) {
    let maxVal = fxTab[0][0];
    let minVal = fxTab[0][0];
    for (let i = 0; i < fxTab.length; ++i) {
        if (fxTab[i][2] > maxVal) {
            maxVal = fxTab[i][2];
        }
        if (fxTab[i][2] < minVal) {
            minVal = fxTab[i][2];
        }
    }
    for (let i = 0; i < fxTab.length; ++i) {
        if (dir == "min") {
            fxTab[i].push(-(fxTab[i][2] - maxVal) + parseFloat(d));
        }
        else {
            fxTab[i].push(fxTab[i][2] - minVal + parseFloat(d));
        }
    }
    return fxTab;
}
export function colLptoPi(gxTab) {
    let sumGx = 0;
    for (let i = 0; i < gxTab.length; ++i) {
        sumGx += gxTab[i][3];
    }
    for (let i = 0; i < gxTab.length; ++i) {
        gxTab[i].push(gxTab[i][3] / sumGx);
    }
    return gxTab;
}
export function colPitoQi(qxTab, a, b, d, pk, pm) {
    qxTab[0][5] = qxTab[0][4];
    const l = Math.ceil(Math.log2((b - a) / d + 1));

    for (let i = 1; i < qxTab.length; ++i) {
        qxTab[i][5] = qxTab[i - 1][5] + qxTab[i][4];
    }
    for (let i = 0; i < qxTab.length; ++i) {
        qxTab[i].push(Math.random());
    }
    for (let i = 0; i < qxTab.length; ++i) {
        let r = qxTab[i][6];
        for (let j = 0; j < qxTab.length; ++j) {
            let actualx = qxTab[j][1];
            let prevqi;
            let qi = qxTab[j][5];
            if (j == 0) {
                prevqi = 0;
            }
            else {
                prevqi = qxTab[j - 1][5];
            }
            if (prevqi < r && r <= qi) {
                qxTab[i].push(actualx);
                let temp = IntToBin(RealToInt(a, b, l, actualx), l);
                qxTab[i].push(temp);

            }
        }
    }

    let Parents = selectParents(pk, qxTab.map((row) => row[8]));
    qxTab.forEach((row, i) => {
        row.push(Parents[i]);
    })

    const [pc, crossedChildren] = crossingAllParents(qxTab.map((row) => row[9]),l);
    qxTab.forEach((row, i) => {
        row.push(pc[i]);
        row.push(crossedChildren[i]);
    })

    for(let i=0;i<qxTab.length;++i)
    {
        if(qxTab[i][11]==="")
        {
            qxTab[i][11] = qxTab[i][8]; 
        }
    }

    for(let i=0;i<qxTab.length; ++i)
    {
        let beforeMutation = qxTab[i][11]
        let beforeMutationArray = beforeMutation.split("");
        let mutatedBits = [];
        for(let j=0;j<beforeMutationArray.length;++j)
        {
            let mutationRand = Math.random();
            if(mutationRand <= pm)
            {
                beforeMutationArray[j] = beforeMutationArray[j] == "0" ? "1" : "0";
                mutatedBits.push(j+1); 
            }
        }
        qxTab[i].push(mutatedBits.join(","));
        qxTab[i].push(beforeMutationArray.join(""));
        qxTab[i].push(round(IntToReal(a,b,l,BinToInt(beforeMutationArray.join(""))),d));
        qxTab[i].push(f(IntToReal(a,b,l,BinToInt(beforeMutationArray.join("")))));
        
    }

    return qxTab;
}

function selectParents(pk, selX) {
    let fillXBin = [];

    for (let i = 0; i < selX.length; ++i) {
        fillXBin.push(Math.random() <= pk)
    }
    let numberOfParents = fillXBin.reduce((sum, currItem) => {
        if (currItem) {
            ++sum;
        }
        return sum;
    }, 0)
    if (numberOfParents === 1) {
        for (let i = 0; i < selX.length; ++i) {
            if (!fillXBin[i]) {
                fillXBin[i] = true;
                break;
            }
        }
    }

    fillXBin = fillXBin.map((isParent, i) => {
        const selXi = selX[i];
        return isParent ? selXi : "";
    })
    return fillXBin;
}

function crossingAllParents(columnParents, l) {
    const fillCross = Array(columnParents.length);
    fillCross.fill("");

    const fillRandom = Array(columnParents.length);
    fillRandom.fill("");
    const numberOfParents = columnParents.reduce((sum, currItem) => {
        if (currItem !== "") {
            return ++sum;
        }
        return sum;
    }, 0);

    let lastParent = -1;

    if (numberOfParents % 2 != 0) {
        let firstParent;
        let secondParent;
        for (let i = 0; i < Math.floor(numberOfParents / 2); ++i) {

            lastParent++;

            firstParent = nextOccupiedIndex(columnParents, lastParent);
            secondParent = nextOccupiedIndex(columnParents, firstParent + 1);

            lastParent = secondParent;

            let crossingPoint = Math.floor((Math.random() * (l - 1)) + 1);
            fillRandom[firstParent] = crossingPoint;
            fillRandom[secondParent] = crossingPoint;
            const [firstChild, secondChild] = crossingPairs(columnParents[firstParent], columnParents[secondParent], crossingPoint);
            fillCross[firstParent] = firstChild;
            fillCross[secondParent] = secondChild;
        }
        firstParent = nextOccupiedIndex(columnParents, lastParent + 1);
        secondParent = nextOccupiedIndex(columnParents, 0);
        let crossingPoint = Math.floor((Math.random() * (l - 1)) + 1);
        fillRandom[firstParent] = crossingPoint;
        const [firstChild, secondChild] = crossingPairs(columnParents[firstParent], columnParents[secondParent], crossingPoint);
        fillCross[firstParent] = firstChild;
    }
    else {
        for (let i = 0; i < Math.floor(numberOfParents / 2); ++i) {
            let firstParent;
            let secondParent;
            lastParent++;

            firstParent = nextOccupiedIndex(columnParents, lastParent);
            secondParent = nextOccupiedIndex(columnParents, firstParent + 1);

            lastParent = secondParent;

            let crossingPoint = Math.floor((Math.random() * (l - 1)) + 1);
            fillRandom[firstParent] = crossingPoint;
            fillRandom[secondParent] = crossingPoint;
            const [firstChild, secondChild] = crossingPairs(columnParents[firstParent], columnParents[secondParent], crossingPoint);
            fillCross[firstParent] = firstChild;
            fillCross[secondParent] = secondChild;
        }
    }

    return [fillRandom, fillCross];
}
function nextOccupiedIndex(array, indexStart) {
    for (let i = indexStart; i < array.length; ++i) {
        if (array[i] != ("")) {
            return i;
        }
    }
}

function crossingPairs(firstParent, secondParent, crossingPoint) {
    let firstChild = firstParent.slice(0, crossingPoint) + secondParent.slice(crossingPoint);
    let secondChild = secondParent.slice(0, crossingPoint) + firstParent.slice(crossingPoint);
    return [firstChild, secondChild];
}
function round(number, d) {
    return parseFloat(number).toFixed(Math.abs(Math.round(Math.log10(d))));
};
function createArrayFromNumber(n) {
    return Array.from({ length: n }, (_, i) => i + 1);
};
function calculateTableRow(a, b, d, i) {

    const row = [];
    row.push(i);
    let inputX = genX(a, b, d);
    row.push(inputX);
    row.push(f(inputX));
    return row;
}
