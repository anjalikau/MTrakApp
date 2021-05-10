using System.Threading.Tasks;
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
        public async Task<IActionResult> GetMenuListAsync()  
        {  
            return Ok(await _testRepository.GetMenuListAsync());  
        }  
    }
}