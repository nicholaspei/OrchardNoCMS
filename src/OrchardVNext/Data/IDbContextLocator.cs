using System;
using Microsoft.Data.Entity;

namespace OrchardVNext.Data
{
    public interface IDbContextLocator 
    {
        DbContext For(Type entityType);
    }
}