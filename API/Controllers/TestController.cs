using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TestController : BaseApiController
    {
        private readonly ITestRepository _testRepository;
        public TestController(ITestRepository testRepository)
        {
            _testRepository = testRepository;
        }

        [HttpGet("menus")]  
        [Produces("application/xml")]
        public async Task<IActionResult> GetMenuListAsync()  
        { 
            var menu = await _testRepository.GetMenuListAsync();
            return Ok(menu);  
        }


        // public static string ObjectToXml(IEnumerable<MenuJoinList> menu)
        // {
        //     XmlSerializer xmlSerializer = new XmlSerializer(typeof(MenuJoinList));
        //     using (StringWriter textWriter = new StringWriter())
        //     {
        //         foreach (var item in menu)
        //         {
        //             xmlSerializer.Serialize(textWriter, item);
                    
        //         }
        //         return textWriter.ToString();
        //     }
        // }

    }
}