import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true, trim: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
)

const iPhoneSchema = new mongoose.Schema(
  {
    released: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    dimensions: {
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      depth: {
        type: Number,
        required: true,
      },
    },
    weight: {
      type: Number,
      required: true,
    },
    displayType: {
      type: String,
      required: true,
    },
    displaySize: {
      type: Number,
      required: true,
    },
    resolution: {
      type: String,
      required: true,
      match: /^[0-9]+x[0-9]+$/,
    },
    protection: {
      type: String,
      required: true,
    },
    chipSet: {
      type: String,
      required: true,
    },
    cpu: {
      type: String,
      required: true,
    },
    gpu: {
      type: String,
      required: true,
    },
    os: {
      original: {
        type: String,
        required: true,
      },
      upgrade: {
        type: String,
        required: true,
      },
    },
    memory: [
      {
        rom: {
          type: String,
          required: true,
        },
        ram: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    camera: {
      rear: [
        {
          type: Number,
          required: true,
        },
      ],
      front: {
        type: Number,
        required: true,
      },
    },
    battery: {
      type: String,
      required: true,
    },
    images: [
      {
        color: {
          type: String,
          required: true,
          match: /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
        },
        img: {
          type: String,
          required: true,
        },
      },
    ],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 1,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const iPhone = mongoose.model('iPhone', iPhoneSchema)

export default iPhone
