import express, { Errback } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { Request, Response } from 'express';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.get("/filteredimage", async (req: Request, res: Response) => {
    try {
      // image url
      const image_url: string = req.query.image_url || '';
      // validate the image_url query
      if(image_url == '') {
        console.log(`Invalid image_url`);
        return res.status(400).json('Invalid image url');
      }
      console.log(`imageUrl: ${image_url}`);
      // send the resulting file in the response
      const image_path: string = await filterImageFromURL(image_url);
      console.log(`imagePath: ${image_path}`);
      return res.status(200).sendFile(image_path, async (err: Errback) => {
          // deletes any files on the server on finish of the response
          console.log(`deletes file on the server on finish of the response`);
          await deleteLocalFiles([image_path]);
          console.log(`deletes file sucessfully`);
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json("internal server!");
    }
  });
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();