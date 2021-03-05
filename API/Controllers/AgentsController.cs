using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{    
    public class AgentsController : BaseApiController
    {
        private readonly DataContext _context;
        public AgentsController(DataContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MstrAgents>>> GetUsers()
        {
            return await _context.MstrAgents
                        .Where(s => s.bActive == 1).ToListAsync();
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<MstrAgents>> GetUsers(int id)
        {
            return await _context.MstrAgents.FindAsync(id);
        }
    }
}