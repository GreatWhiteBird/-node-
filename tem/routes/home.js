const router = require('koa-router')()

router.post("/upload",async function(ctx){

        const file=await ctx.request.files.file;
        ctx.body={
            code:0,
            
        }
    
});


module.exports = router