using System;
using System.Collections.Generic;
using System.Data;
using Orchard.Data.Migration;

namespace Orchard.Car {
    public class Migrations : DataMigrationImpl {

        public int Create() {

            SchemaBuilder.CreateTable("CarInfo",
                table=>table
                    .Column<int>("Id",column=>column.PrimaryKey().Identity())
                    .Column<string>("Name",column=>column.WithLength(50))
                    .Column<string>("Description",column=>column.WithLength(255))
                    .Column<float>("Price")
                    .Column<int>("BrandId")
                    .Column<int>("SeatNum")
                );
            return 1;
        }

      
    }
}