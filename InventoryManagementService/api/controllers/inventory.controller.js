import Cake from "../models/cake.model.js";
import { errorHandler } from "../utils/error.js";
import User from '../models/user.model.js';

export const create = async (req, res, next) => {
  try {
   
    if (!req.body.title || !req.body.description || !req.body.price) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newCake = new Cake({
      ...req.body,
      slug,
      userId: req.user.id,
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
    const queryOptions = { userId: req.user.id }; 

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
    
    // Find the user by userId
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



