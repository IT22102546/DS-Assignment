import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({

    Blogname:{

        type:String,
        required:true,
        

    },

    descreption:{

        type:String,
        required:true,
       

    },

   
    

    category:{

        type:String,
        required:true,
      
    },

    slug: {
        type: String,
        required: true,
        unique: true,
      },

   Picture:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBSPORSQPAj178RTOCpHeHuI4lly2RAUXAnA&s" 
    },

   
},{timestamps:true})

const Blog = mongoose.model('Blog',blogSchema);
export default Blog;

//finished