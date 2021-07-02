using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Master.CustomerAddressList")]
    public class MstrCustomerAddressList
    {
        [Key]
        public int AutoId {get;set;}
        public int CustomerId {get;set;}
        public string AddressCode {get;set;}
        public string AddressCodeName {get;set;}
        public string AddressTo {get;set;}
        public string Address {get;set;}
        public string City {get;set;}
        public string ZipPostalCode {get;set;}
        public int CountryId {get;set;}
        public string VATNo {get;set;}
        public string TaxNo {get;set;}
        public string TinNo {get;set;}
        public int CurrencyId {get;set;}
        public bool bActive {get;set;}
        public int ? CreateUserId { get; set; }
        public DateTime ? CreateDateTime { get; set; }
        public int ? UpdateUserId { get; set; }
        public DateTime ? UpdateDateTime { get; set; }
    }
}