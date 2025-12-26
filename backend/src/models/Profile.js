import mongoose from 'mongoose';

const profileSchema=mongoose.Schema({
    name:{type:String,required:true}
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;