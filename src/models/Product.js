import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [
                100,
                'Product name cannot be longer than 100 characters'
            ]
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            maxlength: [
                1000,
                'Description cannot be longer than 1000 characters'
            ]
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative']
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true
        },
        inStock: {
            type: Boolean,
            default: true
        },
        tags: [
            {
                type: String,
                trim: true
            }
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Index for faster queries
productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
