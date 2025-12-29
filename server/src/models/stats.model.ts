import { Schema, model, Document } from 'mongoose'

export interface IContentTypeStat {
    name: string
    percentage: number
    timeSpent: number
}

export interface IChildContentStats extends Document {
    contentTypes: IContentTypeStat[]
    totalTime: number
    riskScore:number
    riskLevel: 'low' | 'medium' | 'high'
    lastUpdated: Date
}

const ContentTypeStatSchema = new Schema<IContentTypeStat>({
    name: {
        type: String,
        required: true
    },
    percentage: {
        type: Number,
        required: true,
        default: 0
    },
    timeSpent: {
        type: Number,
        required: true,
        default: 0
    }
})

const ChildContentStatsSchema = new Schema<IChildContentStats>({
    contentTypes: {
        type: [ContentTypeStatSchema],
        default: []
    },
    totalTime: {
        type: Number,
        default: 0
    },
    riskScore:{
      type:Number,
      default:0,
    },
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

export const ChildContentStats = model<IChildContentStats>('ChildContentStats', ChildContentStatsSchema)
