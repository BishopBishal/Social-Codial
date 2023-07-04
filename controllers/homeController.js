module.exports.home=function (req,res){
  return  res.render('home',{title:'HomePage'});
}

//module.exports.actionName=function (req,res){ return res.end("<h1>Action</h1>");}