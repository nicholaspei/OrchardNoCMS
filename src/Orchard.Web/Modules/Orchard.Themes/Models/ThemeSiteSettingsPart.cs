

namespace Orchard.Themes.Models {
    public class ThemeSiteSettingsPart {
        public virtual int Id { get; set; }
        public virtual string CurrentThemeName
        {
            get;
            set;
        }
    }
}