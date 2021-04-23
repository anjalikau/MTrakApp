using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Trans.ErrorLog")]
    public class ErrorLog
    {
        [Key]
        public int ErrorLogID { get; set; }
        public DateTime ErrorTime { get; set; }
        
        [Column(TypeName = "varchar(20)")]
        public string UserName { get; set; }
        public int ErrorNumber { get; set; }
        public int ErrorSeverity { get; set; }
        public int ErrorState { get; set; }

        [Column(TypeName = "varchar(150)")]
        public string ErrorProcedure { get; set; }
        public int ErrorLine { get; set; }

        [Column(TypeName = "varchar(max)")]
        public string ErrorMessage { get; set; }

        [Column(TypeName = "varchar(30)")]
        public string Module { get; set; }

    }
}