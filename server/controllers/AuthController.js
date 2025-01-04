export const signup = async (request, response, next)=>{
    try {
        const {email, password}= request.body;
        if(!email || !password){
            return response.status(400).send("Email and Pa")
        }
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
}