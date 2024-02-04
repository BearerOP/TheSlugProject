const axios = require('axios');

exports.download_link_provider = async(req,res)=>{
    let download_link = req.body.download_link;

    try {
        const options = {
            method: 'GET',
            url: 'https://instagram-downloader-download-instagram-videos-stories3.p.rapidapi.com/instagram/v1/get_info/',
            params: {
              url: `${download_link}`
            },
            headers: {
              'X-RapidAPI-Key': '3c789f9123msh3274719871c0c25p1cf51djsn5d700889e62a',
              'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories3.p.rapidapi.com'
            }
          };
        const response = await axios.request(options);
        // console.log(response.data);
        return{
            success:true,
            data:response.data
        }
    } catch (error) {
        console.error(error);
    }
}