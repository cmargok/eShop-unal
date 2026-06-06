using System.IO;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ClientApp.UnitTests;

[TestClass]
public class CartPageTests
{
    [TestMethod]
    public void CartPageDeclaresMaxQuantityAndClampsValuesAboveThree()
    {
        var cartPagePath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory,
            "..", "..", "..", "..", "..",
            "src", "WebApp", "Components", "Pages", "Cart", "CartPage.razor"));

        Assert.IsTrue(File.Exists(cartPagePath), $"Expected CartPage at {cartPagePath}");

        var content = File.ReadAllText(cartPagePath);
        Assert.IsTrue(content.Contains("max=\"3\""), "El campo de cantidad debe incluir max=\"3\".");
        Assert.IsTrue(content.Contains("oninput=\"if (this.value > 3) this.value = 3;\""), "El campo de cantidad debe restringir valores mayores a 3.");
    }
}
