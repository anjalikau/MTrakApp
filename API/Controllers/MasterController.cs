using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MasterController : BaseApiController
    {
        private readonly IMasterRepository _masterRepository;
        private readonly IMapper _mapper;
        public MasterController(IMasterRepository masterRepository, IMapper mapper)
        {
            _mapper = mapper;
            _masterRepository = masterRepository;
        }

        [HttpGet("Factory")]
        public async Task<ActionResult<IEnumerable<FactoryDto>>> GetFactories()
        {
            var factories = await _masterRepository.FactoriesAsync();
            var factoryToReturn = _mapper.Map<IEnumerable<FactoryDto>>(factories);
            return Ok(factoryToReturn);
        }

        [HttpGet("AgentLevel/{id}")]
        public async Task<ActionResult<IEnumerable<UserLevelDto>>> GetAgentLevel(int id)
        {
            var levels = await _masterRepository.AgentLevelsAsync(id);
            var levelToReturn = _mapper.Map<IEnumerable<UserLevelDto>>(levels);
            return Ok(levelToReturn);
        }
    }
}