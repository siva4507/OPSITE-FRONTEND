"use client";

import React from "react";
import Lottie from "lottie-react";
import loaderAnimation from "@/src/assets/loader/Animation - 1.json";

const Loader: React.FC = () => (
  <div style={{ width: 100, height: 100 }}>
    <Lottie animationData={loaderAnimation} loop={true} />
  </div>
);

export default Loader;
