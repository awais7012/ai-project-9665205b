import mongoose from 'mongoose';

interface CartItem {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

interface Cart {
  userId: mongoose.Schema.Types.ObjectId;
  items: CartItem[];
  totalPrice: number;
}

const CartSchema = new mongoose.Schema<Cart>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  }],
  totalPrice: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

CartSchema.pre('save', async function (next) {
  try {
    if (this.isModified('items')) {
      const populatedCart = await this.populate({
        path: 'items.productId',
        model: 'Product',
      });

      let totalPrice = 0;
      if (populatedCart.items && Array.isArray(populatedCart.items)) {
        for (const item of populatedCart.items) {
          if (item.productId && typeof item.productId === 'object' && 'price' in item.productId && typeof item.quantity === 'number') {
            totalPrice += (item.productId.price || 0) * item.quantity;
          }
        }
      }
      this.totalPrice = totalPrice;
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

export const Cart = mongoose.model<Cart>('Cart', CartSchema);