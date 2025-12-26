import Profile from '../models/Profile.js';
import {validationResult } from 'express-validator'

export const getProfile=async(req,res)=>{
    try {
        const {search}=req.query;
        let filter={};
        if(search && search.trim()){
            filter={
                name:{$regex:search.trim(),$options:'i'}
            }
        }
        const profiles=await Profile.find(filter).sort({name:1});
        return res.json({success:true,data:profiles});
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"something wents wrong"});
    }
}

export const addProfile = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].message
      });
    }

    const { name } = req.body;

    const profile=await Profile.findOne({name});
    if(profile){
        return res.json({success:false,message:"Profile is already exist"});
    }

    const newProfile = await Profile.create({ name });

    return res.json({ success: true, data: newProfile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};