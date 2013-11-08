using System;
using System.ComponentModel.DataAnnotations;
using Orchard.Data.Conventions;
using Orchard.Settings;

namespace Orchard.Core.Settings.Models {
    public sealed class SiteSettingsPart :ISite {

        public Guid Id
        {
            get;
            set;
        }

        public string PageTitleSeparator
        {
            get;
            set;
        }

        public string SiteName {
            get;
            set;
        }

        public string SiteSalt
        {
            get;
            set;
        }

        public string SuperUser {
            get;
            set;
        }

        public string HomePage {
            get;
            set;
        }

        public string SiteCulture {
            get;
            set;
        }

        public ResourceDebugMode ResourceDebugMode {
            get;
            set;
        }

        public int PageSize {
            get;
            set;
        }

        public string SiteTimeZone {
            get;
            set;
        }

        [StringLengthMax]
        public string BaseUrl {
            get;
            set;
        }
    }
}
