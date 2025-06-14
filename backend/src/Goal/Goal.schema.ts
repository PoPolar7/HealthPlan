  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import { Document } from 'mongoose';

  export type GoalDocument = Goal & Document;

  @Schema()
  export class Goal {
     @Prop({ required: true }) userId: string; 
    @Prop({ required: true })
    goal: string;

    @Prop()
    frequency: number;

    @Prop()
    difficulty: string;
    
  }

  export const GoalSchema = SchemaFactory.createForClass(Goal);