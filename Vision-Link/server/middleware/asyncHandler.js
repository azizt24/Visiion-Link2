// // asyncHandler.js
// const asyncHandler = (fn) => async (req, res) => {
//   try {
//     await Promise.resolve(fn(req, res));
//   } catch (error) {
//     // Handle errors here, you can customize this part based on your needs
//     console.error("Error in asyncHandler:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };

// export default asyncHandler;
