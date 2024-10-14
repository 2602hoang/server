import express from "express";
import axios from "axios";

const router = express.Router();

const handlePostRequest = async (targetUrl, formData, res) => {
  try {
    await axios.post(targetUrl, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.status(200).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Form submission error:", error.message || error);
    res.status(500).json({ message: "Form submission failed" });
  }
};

// booking bookstore
const send = async (req, res) => {
  if (req.method === "POST") {
    const { name, phone, email, address, note, option } = req.body;

    // if (!name || !phone || !email || !address) {
    //   return res.status(400).json({ message: 'Missing required fields' });
    // }

    const formData = { name, phone, email, address, note, option };
    const targetUrl =
      "https://script.google.com/macros/s/AKfycbyjvqU26Nkq1l0Gr8_0YxfsLFsF8g8o2VmAu11rjQiG6YqfYPdGTsdxQBP1r7SHOLab/exec";

    return handlePostRequest(targetUrl, formData, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

// zidi
const zidi = async (req, res) => {
  if (req.method === "POST") {
    const { name, phone, email, address, note, rate } = req.body;

    // if (!name || !phone || !email || !address) {
    //   return res.status(400).json({ message: 'Missing required fields' });
    // }

    const formData = { name, phone, email, address, note, rate };
    const targetUrl =
      "https://script.google.com/macros/s/AKfycbzQKzEuh0fX2vKXgBHVaO-fAigdOlZUphgU6d5bFL93Ju6ldwJHENYjv-_wwSHzd0i8/exec";

    return handlePostRequest(targetUrl, formData, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

// Uncomment and use if the GET endpoint is needed
const getzidi = async (req, res) => {
  if (req.method === "GET") {
    try {
      const targetUrl =
        "https://script.google.com/macros/s/AKfycbzQKzEuh0fX2vKXgBHVaO-fAigdOlZUphgU6d5bFL93Ju6ldwJHENYjv-_wwSHzd0i8/exec";
      const response = await axios.get(targetUrl);

      // Process the data
      const data = response.data;

      // Example processing: Filter out entries with empty 'time'
      const processedData = data.filter((entry) => entry.time !== "");

      // Example processing: Convert timestamps to readable format
      const formattedData = processedData.map((entry) => ({
        ...entry,
        time: new Date(entry.time).toLocaleString(), // Convert ISO timestamp to local date string
      }));

      res.status(200).json(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error.message || error);
      res.status(500).json({ message: "Error fetching data" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: "Method not allowed" });
  }
};
const getapi = async (req, res) => {
  if (req.method === "GET") {
    try {
      const targetUrl =
        "https://script.google.com/macros/s/AKfycbz9ZnDO5RkQ7ep0jTF7RryOq6wa82WnU4w4n6fF7yP-WqqqqmkfWjAmwldgoqsTaFap/exec";
      const response = await axios.get(targetUrl);
      const data = response.data;
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching data:", error.message || error);
      res.status(500).json({ message: "Error fetching data" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: "Method not allowed" });
  }
};
const getcomments = async (req, res) => {
  if (req.method === "GET") {
    try {
      const targetUrl =
        "https://script.google.com/macros/s/AKfycby4ojgHvS93MavESTOWHFW0Hza-yj4XKzx7MB3fazG9d7NHjCtE7HzF_9sp-BGSbnJx1Q/exec";
      const response = await axios.get(targetUrl);
      const data = response.data;
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching data:", error.message || error);
      res.status(500).json({ message: "Error fetching data" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: "Method not allowed" });
  }
};
const postcomments = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { id, username, phone, role, comments, repkey } = req.body;
      const targetUrl =
        "https://script.google.com/macros/s/AKfycby4ojgHvS93MavESTOWHFW0Hza-yj4XKzx7MB3fazG9d7NHjCtE7HzF_9sp-BGSbnJx1Q/exec";
      const formData = { id, username, phone, role, comments, repkey };
      await axios.post(targetUrl, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      res.status(200).json({ message: "Comment submitted successfully" });
    } catch (error) {
      console.error("Comment submission error:", error.message || error);
      res.status(500).json({ message: "Comment submission failed" });
    }
  }
};
// const getcommentsbyId = async (req, res) => {
//   if (req.method === "GET") {
//     try {
//       const { id } = req.query;
//       const targetUrl =
//         "https://script.google.com/macros/s/AKfycbx-FoGX2neRtmxAgxxS38NSPyHC4btsMF0_mD1tPYqr3a5BBEtC-avN7yH9sgOKqcfgCw/exec";
//       const response = await axios.get(targetUrl, { params: { id } });
//       const data = response.data;
//       res.status(200).json(data);
//     } catch (error) {
//       console.error("Error fetching data:", error.message || error);
//       res.status(500).json({ message: "Error fetching data" });
//     }
//   }
// };
// Routes
router.post("/send", send);
router.post("/zidi", zidi);
router.get("/zidi/get", getzidi);
router.get("/api/get", getapi);
router.get("/admin/get", getcomments);
// router.get("/admin/get/:id", getcommentsbyId);
router.post("/admin/post", postcomments);
export default router;
