using eShop.Ordering.API.Application.Models;

namespace eShop.Ordering.API.Application.Validations;
public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
{
    private const int MaxUnitsPerProduct = 3;

    public CreateOrderCommandValidator(ILogger<CreateOrderCommandValidator> logger)
    {
        RuleFor(command => command.City).NotEmpty();
        RuleFor(command => command.Street).NotEmpty();
        RuleFor(command => command.State).NotEmpty();
        RuleFor(command => command.Country).NotEmpty();
        RuleFor(command => command.ZipCode).NotEmpty();
        RuleFor(command => command.CardNumber).NotEmpty().Length(12, 19);
        RuleFor(command => command.CardHolderName).NotEmpty();
        RuleFor(command => command.CardExpiration).NotEmpty().Must(BeValidExpirationDate).WithMessage("Please specify a valid card expiration date");
        RuleFor(command => command.CardSecurityNumber).NotEmpty().Length(3);
        RuleFor(command => command.CardTypeId).NotEmpty();
        RuleFor(command => command.OrderItems).Must(ContainOrderItems).WithMessage("No order items found");
        RuleForEach(command => command.OrderItems).ChildRules(orderItem =>
        {
            orderItem.RuleFor(item => item.Units)
                .GreaterThan(0)
                .LessThanOrEqualTo(MaxUnitsPerProduct)
                .WithMessage($"Each product can contain at most {MaxUnitsPerProduct} units.");
        });
        RuleFor(command => command.OrderItems)
            .Must(HaveAtMostThreeUnitsPerProduct)
            .WithMessage($"A product cannot have more than {MaxUnitsPerProduct} units in the order.");

        if (logger.IsEnabled(LogLevel.Trace))
        {
            logger.LogTrace("INSTANCE CREATED - {ClassName}", GetType().Name);
        }
    }

    private bool BeValidExpirationDate(DateTime dateTime)
    {
        return dateTime >= DateTime.UtcNow;
    }

    private bool ContainOrderItems(IEnumerable<OrderItemDTO> orderItems)
    {
        return orderItems.Any();
    }

    private static bool HaveAtMostThreeUnitsPerProduct(IEnumerable<OrderItemDTO> orderItems)
    {
        return orderItems
            .GroupBy(item => item.ProductId)
            .All(group => group.Sum(item => item.Units) <= MaxUnitsPerProduct);
    }
}
