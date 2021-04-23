using System.Linq;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<MstrAgents, RegisterDto>();
                 //.ForMember(dest => dest.iCategoryLevel, opt => opt.MapFrom(src => src.Category_Link.AutoId))
                // .ForMember(dest => dest.FactoryId, opt => opt.MapFrom(src => src.Factory_Link.AutoId));
                // .ForMember(dest => dest.FactoryId , opt => 
                //     opt.MapFrom(mst => mst.Factory_Link.AutoId))  
            // CreateMap<RegisterDto,MstrAgents>();            
            CreateMap<MstrFactory , FactoryDto>();
            CreateMap<MstrAgentLevel , UserLevelDto>();
            CreateMap<RegisterDto, MstrAgents>();
            CreateMap<UserUpdateDto, MstrAgents>();
            CreateMap<MstrAgents , PermitedUserDto>();
        }
    }
}