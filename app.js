const express=require("express");
const mysql=require("mysql");
const bodyParser=require("body-parser");
//const request=require("request");
const ejs=require('ejs');

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static('public'));
var connection=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"password",
  database:"realprojectpost"
});
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

// connection.query('show Tables',function(error,results,field){
//   if(error){
//     throw error;
//   }
// //  for(var i=0;i<results.length;i++){
//     //console.log(results[i]);
// //  }
// })
//svar referpag="";
//var referpageJ="job";
//var referpageR="result";

app.get('/',function(req,res){

  var query="select * from latest_job";
  connection.query(query,function(error,results,fields){
    if(error) throw error;
  var job=results;

  connection.query("select * from result",function(error,results){
    var result=results;

    connection.query("select * from admit_card",function(error,results){
      if(error) throw error;
      let admit_card=results;

      connection.query("select * from admission",function(error,results){
        if(error) throw error;
        let admission=results;

         connection.query("select * from gov_schemes",function(error,results){
           if(error) throw error;
           let gov_scheme=results;

           connection.query("select * from answer_key",function(error,results){
             if(error) throw error;
             let key=results;
           res.render('index',{
             results:result,
             jobs:job,
             admit_cards:admit_card,
             admissions:admission,
             gov_schemes:gov_scheme,
             keys:key
         })
       })
         })

      })


    });
    })
  })
});

//fullpage view
app.get("/view/:pageName",function(req,res){
  var pageName=req.params.pageName;
  if(pageName==="results")
  {
    connection.query("select * from result",function(error,results){
      if(error) throw error;
       res.render("fullview",{
        results:results,
        fieldName:"results"
      })
    })
  }

  if(pageName==="latestJob")
  {
    connection.query("select * from latest_job",function(error,results){
      if(error) throw error;
      res.render("fullview",{
        jobs:results,
        fieldName:"jobs"
      })
    })
  }
  if(pageName==="admission")
  {
    connection.query("select * from admission",function(error,results){
      if(error) throw error;
       res.render("fullview",{
        admissions:results,
        fieldName:"admissions"
      })
    })
  }
  if(pageName==="gov_schemes")
  {
    connection.query("select * from gov_schemes",function(error,results){
      if(error) throw error;
       res.render("fullview",{
        gov_schemes:results,
        fieldName:"gov_schemes"
      })
    })
  }
  if(pageName==="admitcards")
  {
    connection.query("select * from admit_card",function(error,results){
      if(error) throw error;
        res.render("fullview",{
        admit_cards:results,
        fieldName:"admitCards"
      })
    })
  }
  if(pageName==="answerKey")
  {
    connection.query("select * from result",function(error,results){
      if(error) throw error;
       res.render("fullview",{
        keys:results,
        fieldName:"answerKeys"
      })
    })
  }
})
//end fullpageview
//admin page

//admin page end


app.get("/createget/:createField",function(req,res){
  var fieldName=req.params.createField;
  res.render("create",{
    fieldName:fieldName
  });
});


app.post("/createpost/:createNew",function(req,res){
var editField=req.params.createNew;

if(editField==="admit_cards")
{
  var admit_name=req.body.AdmitCardName;
  var link=req.body.link;
  var syllabus=req.body.syllabus;
  //var process=req.body.process;
  var prev_y_q=req.body.prev_y_q;

 let query="INSERT INTO admit_card (name,link) SELECT * FROM (SELECT ?,?) AS tmp WHERE NOT EXISTS (SELECT name FROM result WHERE name = ?) LIMIT 1;"
//  let query="insert into admit_card (name,link) values (?,?)";
  let data=[admit_name,link,admit_name];
  connection.query(query,data,function(error,results){
  if(error) throw error;
  admit_id=results.insertId;
  query="insert into syllabus (s_file) values (?)";
  data=syllabus;
  connection.query(query,data,function(error,results){
    if(error) throw error;
    var s_id=results.insertId;

    query="update syllabus set admit_id=? where s_id=?";
    data=[admit_id,s_id];
    connection.query(query,data,function(error,results){
      if(error) throw error;
      query="insert into prev_ques (prev_ques_file) values (?)";
      data=prev_y_q;
      connection.query(query,data,function(error,results){
        if(error) throw error;
        let prev_id=results.insertId;

        query="update prev_ques set admit_id=? where prev_id=?";
        data=[admit_id,prev_id];
        connection.query(query,data,function(error,results){
          if(error) throw error;
          console.log("happy admit card");
          res.redirect("/");
        })
      })
    })
  })
})
}

if(editField==="job")
{
  var name=req.body.job_name;
  var link=req.body.link;
  var start_date=req.body.init_date;
  var last_date=req.body.last_date;
  var age=req.body.age;
  var syllabus=req.body.syllabus;
  var fee=req.body.fee;
  var prev_q=req.body.prev_y_q;
  var education=req.body.e_e;

  //var process=req.body.process;

 let query="INSERT INTO latest_job (job_name,link) SELECT * FROM (SELECT ?,?) AS tmp WHERE NOT EXISTS (SELECT job_name FROM latest_job WHERE job_name = ?) LIMIT 1;"
//  let query="insert into admit_card (name,link) values (?,?)";
  let data=[name,link,name];
  connection.query(query,data,function(error,results){
  if(error) throw error;
  post_id=results.insertId;
  query="insert into info (fee,qualification,init_date,last_date,age) values (?,?,?,?,?)";
  data=[fee,education,start_date,last_date,age];
  connection.query(query,data,function(error,results){
    if(error) throw error;
    var info_id=results.insertId;

    query="update info set post_id=? where info_id=?";
    data=[post_id,info_id];
    connection.query(query,data,function(error,results){
      if(error) throw error;
      query="insert into prev_ques (prev_ques_file) values (?)";
      data=prev_q;
      connection.query(query,data,function(error,results){
        if(error) throw error;
        let prev_id=results.insertId;

        query="update prev_ques set job_id=? where prev_id=?";
        data=[post_id,prev_id];
        connection.query(query,data,function(error,results){
          if(error) throw error;

          query="insert into syllabus (s_file) values (?)";
          data=syllabus;
          connection.query(query,data,function(error,results){
            if(error) throw error;
            let s_id=results.insertId;

            query="update syllabus set job_id=? where s_id=?";
            data=[post_id,s_id];
            connection.query(query,data,function(error,results){
              if(error) throw error;

          console.log("happy info");
          res.redirect("/");
        })
      })
    })
  })
})
})
})
}

if(editField==="createresult")
{console.log("its working");
  var resultName=req.body.resultName;
  var resultLink=req.body.resultLink;
  let query="INSERT INTO result (name,link) SELECT * FROM (SELECT ?,?) AS tmp WHERE NOT EXISTS (SELECT name FROM result WHERE name = ?) LIMIT 1;"
  let data1=[resultName,resultLink,resultName];
  connection.query(query,
  data1,
  function(error,rows,fields){
    if(error)  throw error;
res.redirect("/");
  });
}

if(editField==="admission"){
  var name=req.body.name;
  var link=req.body.link;
  connection.query("insert into admission (name,link) values (?,?)",[name,link],function(error,results){
    if(error) throw error;
    res.redirect("/");
  })
}
if(editField==="gov_schemes")
{
  var name=req.body.name;
  var link=req.body.link;
connection.query("insert into gov_schemes (name,link) values(?,?)",[name,link],function(error,results){
  if(error) throw error;
   let scheme_id=results.insertId;

      res.redirect("/");

})

}

if(editField==="answerKeyCreate")
{console.log("its working");
  var keyName=req.body.keyName;
  var keyLink=req.body.keyLink;
  let query="INSERT INTO answer_key (name,link) SELECT * FROM (SELECT ?,?) AS tmp WHERE NOT EXISTS (SELECT name FROM answer_key WHERE name = ?) LIMIT 1;"
  let data1=[keyName,keyLink,keyName];
  connection.query(query,
  data1,
  function(error,rows,fields){
    if(error)  throw error;
res.redirect("/");
  });
}

});



app.get("/blog/:resultName",function(req,res){
  let resultName=req.params.resultName;

  connection.query("select * from blog",function(error,results){
    if(error) throw error;
    console.log(results);

    for(var i = 0; i<results.length; i++) {
      if (resultName === results[i].name){

  res.render("blog",{
    r:results[i],

  });
}
    };
  })
})

app.get("/answer-key/:resultName",function(req,res){
  let resultName=req.params.resultName;

  connection.query("select * from answer_key",function(error,results){
    if(error) throw error;
    console.log(results);

    for(var i = 0; i<results.length; i++) {
      if (resultName === results[i].name){

  res.render("answer_key",{
    r:results[i],

  });
}
    };
  })
})

app.get("/Question-Bank/:resultName",function(req,res){
  let resultName=req.params.resultName;

  connection.query("select * from prev_ques",function(error,results){
    if(error) throw error;
    console.log(results);

    for(var i = 0; i<results.length; i++) {
      if (resultName === results[i].name){

  res.render("result",{
    r:results[i],

  });
}
    };
  })
})

app.get("/syllabus/:resultName",function(req,res){
  let resultName=req.params.resultName;

  connection.query("select * from syllabus",function(error,results){
    if(error) throw error;
    console.log(results);

    for(var i = 0; i<results.length; i++) {
      if (resultName === results[i].name){

  res.render("syllabus",{
    r:results[i],

  });
}
    };
  })
})

app.get("/other/:name",function(req,res){
  let resultName=req.params.name;

  connection.query("select * from other_form",function(error,results){
    if(error) throw error;
    console.log(results);

    for(var i = 0; i<results.length; i++) {
      if (resultName === results[i].name){

  res.render("other_form",{
    r:results[i],

  });
}
    };
  })
})

app.get("/admit-card/:name",function(req,res){
  let Name=req.params.name;

  connection.query("select * from admit_card",function(error,results){
    if(error) throw error;
    //console.log(results);

    for(var i = 0; i<results.length; i++) {
      if (Name === results[i].name){

  res.render("main",{
    r:results[i],
    fieldName:"admitCardsView"

  });
}
    };
  })
});

app.get("/result/:resultName",function(req,res){
  let resultName=req.params.resultName;

  connection.query("select * from result",function(error,results){
    if(error) throw error;
    console.log(results);

    for(var i = 0; i<results.length; i++) {
      if (resultName === results[i].name){

  res.render("main",{
    r:results[i],
    fieldName:"resultsView"

  });
}
    };
  })
})

app.get("/job/:postName",function(req,res){
  let postName=req.params.postName;
 //let referPage=req.params.referPage;
 //if(referPage==referpageJ){
  connection.query("select job_name,age,fee,qualification,link,DATE_FORMAT(init_date, '%d/%m/%Y') as init_date,DATE_FORMAT(last_date, '%d/%m/%Y') as last_date from info left join latest_job on info.post_id=latest_job.post_id",
  function(error,results,fields){
    if(error) throw error;

console.log(results);
    for(var i = 0; i<results.length; i++) {
      if (postName === results[i].job_name){
        //var referpage="jobb";
         var post=results[i];
        connection.query("select s_file from syllabus left join latest_job on syllabus.job_id=latest_job.post_id where latest_job.job_name=?",postName,
        function(error,results,fields){
          if(error) throw error;
          var syllabus=results[0].s_file.toString('base64');
          console.log(syllabus);
  res.render("main",{
    r:post,
    fieldName:"jobsView",
    syllabus:syllabus
  //  referralLink:referpage
     });
   });
}
    };
  }) //}
});

// app.get('/download', function(req, res){
//   const file = __dirname + "/public/img/logo.jpeg";
//   res.download(file); // Set disposition and send it.
// });
app.get("/login",(req,res)=>{
  res.render("login");
});
app.post("/login",(req,res)=>{
  if(req.body.uname==="rahul" &&req.body.pwd==="rahul"){
    res.render("admin");
  }
})
app.get("/createBlog",function(req,res){
  res.render("createBlog");
})

app.listen(process.env.PORT||3001,function(){
  console.log("Server Started at 3001");
})
