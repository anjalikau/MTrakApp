using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.CodeDefinition")]
    public class MstrCodeDefinition
    {
        [Key]
        public int AutoId {get;set;}
        public int CategoryId {get;set;}
        public int ProdTypeId {get;set;}
        public int ProdGroupId {get;set;}
        public int SortOrder {get;set;}
        public int IsProductFeild {get;set;}
        public int FlexFeildId {get;set;}
        public string FieldName {get;set;}
        public bool IsCode {get;set;}
        public bool IsName {get;set;}
        public int IsCounter {get;set;}
        public int IsValue {get;set;}
        public int CounterPad {get;set;}
        public string CounterStart {get;set;}
        public int SeqNo {get;set;}
        public bool IsSeperator {get;set;}
        public string Seperator {get;set;}
        public int ? CreateUserId {get;set;}
        public DateTime ? CreateDateTime {get;set;}
        public int ? UpdateUserId {get;set;}
        public DateTime ? UpdateDateTime {get;set;}
    }
}