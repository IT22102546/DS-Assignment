import Cake from "../models/cake.model.js";
import { errorHandler } from "../utils/error.js";
import User from '../models/user.model.js';
import ShopRequest from "../models/shopRequest.model.js";

export const create = async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.description || !req.body.price) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }

    const UserId = req.body.UserId

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newCake = new Cake({
      ...req.body,
      slug,
      UserId
    });

    const savedCake = await newCake.save();
    res.status(201).json(savedCake);
  } catch (error) {
    next(error);
  }
}
export const getCakes = async (req, res, next) => {
  try {
    const { slug, searchTerm, page = 1, limit = 9, category, priceRange } = req.query;
    const queryOptions = {};

    if (slug) {
      queryOptions.slug = slug;
    }

    if (searchTerm) {
      queryOptions.title = { $regex: searchTerm, $options: 'i' };
    }

    if (category) {
      queryOptions.category = category;
    }

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);
      queryOptions.price = { $gte: minPrice, $lte: maxPrice };
    }

    const totalProducts = await Cake.countDocuments(queryOptions);
    const products = await Cake.find(queryOptions)
      .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
      .populate('userId', 'username') 
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};



export const updateCake = async (req, res, next) => {
  try {
    
    if (!req.body.title || !req.body.description || !req.body.price ) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }

    const updatedCake = await Cake.findByIdAndUpdate(
      req.params.productId,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          images: req.body.images,
          price: req.body.price,
          type: req.body.type,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedCake);
  } catch (error) {
    next(error);
  }
};

export const deletecake = async (req, res, next) => {
  try {
   
    await Cake.findByIdAndDelete(req.params.productId);
    res.status(200).json('The product has been deleted');
  } catch (error) {
    next(error);
  }
};

export const featureCake = async (req, res, next) => {
  try {
    

    const updatedCake = await Cake.findByIdAndUpdate(
      req.params.productId,
      { $set: { isFeature: true } },
      { new: true }
    );
    res.status(200).json(updatedCake);
  } catch (error) {
    next(error);
  }
};

export const unfeatureCake = async (req, res, next) => {
  try {
   

    const updatedCake = await Cake.findByIdAndUpdate(
      req.params.productId,
      { $set: { isFeature: false } },
      { new: true }
    );
    res.status(200).json(updatedCake);
  } catch (error) {
    next(error);
  }
};

export const available = async (req, res, next) => {
  try {
    

    const updatedCake = await Cake.findByIdAndUpdate(
      req.params.productId,
      { $set: { isAvailable: true } },
      { new: true }
    );
    res.status(200).json(updatedCake);
  } catch (error) {
    next(error);
  }
};


export const unavailable = async (req, res, next) => {
  try {
    

    const updatedCake = await Cake.findByIdAndUpdate(
      req.params.productId,
      { $set: { isAvailable: false } },
      { new: true }
    );
    res.status(200).json(updatedCake);
  } catch (error) {
    next(error);
  }
};


export const getFeaturedCakes = async (req, res, next) => {
  try {
    const featuredCakes = await Cake.find({ isFeature: true });
    res.status(200).json(featuredCakes);
  } catch (error) {
    next(error);
  }
};

export const getCakesByCategory = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 9 } = req.query;

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const queryOptions = { category };

    const totalProducts = await Cake.countDocuments(queryOptions);
    const products = await Cake.find(queryOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

export const admingetCakes = async (req, res, next) => {
  try {
    const { slug, searchTerm, page = 1, limit = 9, category, priceRange } = req.query;
    const userId = req.headers["userid"]; // Headers are case-sensitive

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const queryOptions = { userId }; // Filter cakes by userId

    if (slug) {
      queryOptions.slug = slug;
    }

    if (searchTerm) {
      queryOptions.title = { $regex: searchTerm, $options: "i" };
    }

    if (category) {
      queryOptions.category = category;
    }

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      queryOptions.price = { $gte: minPrice, $lte: maxPrice };
    }

    const totalProducts = await Cake.countDocuments(queryOptions);
    const products = await Cake.find(queryOptions)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};




export const getCakesByShop = async (req, res) => {
  const { userId } = req.params;
  try {
    const cakes = await Cake.find({ userId });
    res.status(200).json({ success: true, cakes });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch cakes' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user's username
    res.status(200).json({ username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createShopRequest = async (req, res, next) => {
  try {
      const { username, email, password, mobile, address } = req.body;
      console.log(username)

      const mobileRegex = /^(071|076|077|075|078|070|074|072)\d{7}$/;
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+.])[A-Za-z\d!@#$%^&*()_+.]{6,9}$/;

      // Validate input fields
      if (!username || !email || !password || !mobile || !address) {
          return res.status(400).json({ success: false, message: "All fields are required" });
      } else if (!mobileRegex.test(mobile)) {
          return next(errorHandler(400, "Invalid mobile number format"));
      } else if (!passwordRegex.test(password)) {
          return next(errorHandler(400, 'Password should be between 6 and 9 characters long and contain at least one uppercase letter, one digit, and one symbol (!@#$%^&*()_+.).'));
      }else if (username.length < 7 || req.body.username.length > 20) {
          return next(errorHandler(400, 'ShopName must be between 7 and 20 characters'));}
  

      
      const existingUser = await User.findOne({
          $or: [{ email }, { mobile }],
      });

      if (existingUser) {
          if (existingUser.email === email) {
              return next(errorHandler(400, "Email is already in use by another account"));
          }
          if (existingUser.mobile === mobile) {
              return next(errorHandler(400, "Mobile number is already in use by another account"));
          }
      }

     
      const newRideRequest = new ShopRequest({ username, email, password, mobile, address});
      await newRideRequest.save();

      res.status(201).json({ success: true, message: "Shop request created successfully" });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

export const getShops = async (req, res, next) => {
  try {
    
    const admins = await User.find({ isAdmin: true });
    res.status(200).json({ admins });
  } catch (error) {
    console.error("Error in getAdmins controller:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};





