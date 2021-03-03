using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgentsController : ControllerBase
    {
        private readonly DataContext _context;
        public AgentsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MstrAgents>>> GetUsers()
        {
            return await _context.MstrAgents
                        .Where(s => s.bActive == 1).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MstrAgents>> GetUsers(int id)
        {
            return await _context.MstrAgents.FindAsync(id);
        }
    }
}