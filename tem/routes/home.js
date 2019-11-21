const router = require('koa-router')()
const path=require("path")

router.prefix('/home')
router.post("/upload",async function(ctx){
        console.log("开始上传图片")
        const file= await ctx.request.files.file;
        const basename=path.basename(file.path);
         ctx.body={
           url:`${ctx.origin}/upload/${basename}`,//什么语法？
           path:file.path,
           msg:"上传成功"
            
        }
    
});


module.exports = router