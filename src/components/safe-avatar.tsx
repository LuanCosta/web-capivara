"use client";
import { useState } from "react";
export function SafeAvatar({src,initials,className}:{src?:string;initials:string;className:string}){const[failed,setFailed]=useState(false);return <span className={className}>{src&&!failed?<img src={src} alt="" onError={()=>setFailed(true)}/>:initials}</span>}
