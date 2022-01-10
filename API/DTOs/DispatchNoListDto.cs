using System;

namespace API.DTOs
{
    public class DispatchNoListDto
    {
        public long DispatchHdId {get;set;}
        public string DispatchNo {get;set;}
        public string DispatchSite {get;set;}
        public string CustomerRef {get;set;}
        public DateTime TransDate {get;set;}
    }
}