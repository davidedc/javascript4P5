var p = { name: "王磊", "sex": 1, id: "rockswang" }

var str = """尊敬的 \$p.name \${p.sex == 1 ? "先生" : "女士"}， 您的编号是\$p.id"""
println(es(str));
var arr = [0,1,,,,99,,0];
println(es("arr=\${arr.join('-')}"));