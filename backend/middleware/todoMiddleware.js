export const todoValidate = async(req, res, next) => {
    try{
        const {title, status, priority} = req.body;

        //1. field check 
        if(!title || title.trim() === ""){
            return res.status(400).json({
                success: false,
                message: "Title is Required"
            })
        }

        //2.status
        if(status && !["PENDING", "IN_PROGRESS", "DONE"].includes(status)){
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            })
        }

        //3. priority
        if(priority && !["LOW", "MEDIUM", "HIGH"].includes(priority)){
            return res.status(400).json({
                success: false,
                message: "Invalid priority"
            })
        }

        next()

    }
    catch(err){
        next(err)
    }
}