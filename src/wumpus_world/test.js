function abc(x) {
    return [[1,2],[3,3]]
}

let x = [[1,2],[2,3]]

let y =abc(x)

if(JSON.stringify(x)==JSON.stringify(y)) console.log("Yes");
else console.log("No")