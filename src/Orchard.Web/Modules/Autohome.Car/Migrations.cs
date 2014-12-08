using System;
using System.Collections.Generic;
using System.Data;
using Orchard.Data.Migration;

namespace Autohome.Car {
    public class Migrations : DataMigrationImpl {

        public int Create()
        {

            SchemaBuilder.CreateTable("CarInfo", table =>  table
             .Column<int>("Id",column=>column.PrimaryKey().Identity())
             .Column<string>("Name",column=>column.WithLength(50).NotNull())
             .Column<int>("Price")
             .Column<string>("Description",column=>column.WithLength(255))
             );
            return 1;
        }
    }
}