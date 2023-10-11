import express, {Request, Response} from "express";
import fs from "fs";
import path from "path";
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('onyxssi/vc'));

// Define a route to handle file download
app.get('/download/vc', (req: Request, res: Response) => {
  const filePath = path.join(__dirname, 'onyxssi/vc/proofOfIdentity.jwt',);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }

    // Set the appropriate headers for the download
    res.setHeader('Content-Disposition', `attachment; filename=vc`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Create a read stream from the file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
